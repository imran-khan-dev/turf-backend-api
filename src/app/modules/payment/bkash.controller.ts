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

        console.log("paymentIdCheck", paymentId)

        if (!paymentId) return res.status(400).json({ message: "Payment ID is required" });

        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

        console.log("paymentCheck", payment)

        if (!payment) return res.status(404).json({ message: "Payment not found" });

        const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
        console.log("boookingCheck", booking)

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const callbackURL = `${envVars.APP_BASE_URL}/api/v1/payment/callback`;

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

        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "PAID" },
        });

        return res.json({
            message: "Payment created",
            url: response.bkashURL,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const callback = async (req: Request, res: Response) => {
    try {
        const { paymentID } = req.query;
        const origin = envVars.FRONTEND_URL;

        if (!paymentID || typeof paymentID !== "string") {
            return res.redirect(`${origin}/cancel`);
        }

        const executeResponse = await executePayment(bkashConfig, paymentID);
        console.log("Execute Payment Response:", executeResponse);

        if (!executeResponse) {
            return res.redirect(`${origin}/cancel`);
        }

        const success = executeResponse.statusCode === "0000";
        const appPaymentId = executeResponse.merchantInvoiceNumber;

        if (!appPaymentId) {
            console.error("Missing merchantInvoiceNumber!");
            return res.redirect(`${origin}/cancel`);
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
                    providerPaymentId: executeResponse.paymentID,
                    amountPaid: parseFloat(executeResponse.amount) || null,
                    providerResponse: executeResponse,
                    paidAt: success ? new Date() : null,
                },
            });

            // Update booking only on success
            if (success) {
                await tx.booking.update({
                    where: { id: executeResponse.payerReference },
                    data: { status: "CONFIRMED" },
                });
            }
        });

        return res.redirect(success ? `${origin}/success` : `${origin}/cancel`);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const BkashController = {
    makePayment,
    callback,
};
