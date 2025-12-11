import { Request, Response } from "express";
import { createPayment, executePayment } from "./bkash.service";
import { envVars } from "../../config/env";
import { prisma } from "../../../db";


const bkashConfig = {
    base_url: envVars.BKASH_BASE_URL!,
    username: envVars.BKASH_CHECKOUT_URL_USER_NAME!,
    password: envVars.BKASH_CHECKOUT_URL_PASSWORD!,
    app_key: envVars.BKASH_CHECKOUT_URL_APP_KEY!,
    app_secret: envVars.BKASH_CHECKOUT_URL_APP_SECRET!,
};

const makePayment = async (req: Request, res: Response) => {
    try {

        const { paymentId } = req.body;

        if (!paymentId) return res.status(400).json({ message: "Payment ID is required" });

        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });


        if (!payment) return res.status(404).json({ message: "Payment not found" });

        const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const turfPrfile = await prisma.turfProfile.findUnique({ where: { id: booking.turfProfileId } });

        if (!turfPrfile) return res.status(404).json({ message: "Turf Profile not found" });

        const callbackURL = `${envVars.APP_BASE_URL}/api/v1/payment/callback?dBPayId=${encodeURIComponent(paymentId)}&turfProfileSlug=${encodeURIComponent(turfPrfile.slug)}`;

        const paymentDetails = {
            amount: payment.amount,
            callbackURL,
            paymentID: paymentId,
            reference: payment.bookingId,
        };

        const response = await createPayment(bkashConfig, paymentDetails);

        console.log("Create Payment Response:", response);

        if (response.statusCode !== "0000") {
            return res.status(400).json({ message: "Payment failed" });
        }


        return res.json({
            message: "Payment created",
            transantionStatus: response.transactionStatus,
            url: response.bkashURL,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const callback = async (req: Request, res: Response) => {
    try {
        const { paymentID, dBPayId, turfProfileSlug } = req.query;

        const origin = envVars.FRONTEND_URL;

        const dbPaymentId = await prisma.payment.findUnique({ where: { id: dBPayId as string } });


        if (!paymentID || typeof paymentID !== "string") {
            return res.redirect(`${origin}/payment/cancel?bookingId=${dbPaymentId?.bookingId}&turfProfileSlug=${turfProfileSlug}`);
        }

        const executeResponse = await executePayment(bkashConfig, paymentID);
        console.log("Execute Payment Response:", executeResponse);

        if (executeResponse.statusCode !== "0000") {
            return res.redirect(`${origin}/payment/cancel?bookingId=${dbPaymentId?.bookingId}&turfProfileSlug=${turfProfileSlug}`);
        }

        const success = executeResponse.statusCode === "0000";
        const appPaymentId = executeResponse.merchantInvoiceNumber;

        if (!appPaymentId) {
            console.error("Missing merchantInvoiceNumber!");
            return res.redirect(`${origin}/payment/cancel?bookingId=${dbPaymentId?.bookingId}&turfProfileSlug=${turfProfileSlug}`);
        }

        // Transaction because we update 2 tables
        await prisma.$transaction(async (tx) => {
            // Update payment
            await tx.payment.update({
                where: { id: appPaymentId },
                data: {
                    status: success ? "PAID" : "FAILED",
                    trxId: executeResponse.trxID || null,
                    providerPaymentStatus: executeResponse.transactionStatus || null,
                    providerPaymentId: executeResponse.paymentID || null,
                    amountPaid: parseFloat(executeResponse.amount) || null,
                    providerResponse: executeResponse,
                    paidAt: success ? new Date() : null,
                },
            });

            // Update booking only on success
            if (success) {
                await tx.booking.update({
                    where: { id: executeResponse.payerReference },
                    data: { status: "CONFIRMED", paymentStatus: "PAID" },
                });
            }
        });

        return res.redirect(`${origin}/payment/success?bookingId=${executeResponse.payerReference}&turfProfileSlug=${turfProfileSlug}`);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const BkashController = {
    makePayment,
    callback,
};
