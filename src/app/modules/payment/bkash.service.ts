// src/modules/payments/bkash.service.ts
import fetch from "node-fetch";
import { envVars } from "../../config/env";
import { prisma } from "../../../db";

/**
 * getBkashToken - obtain bKash token (access)
 * NOTE: adjust per bKash docs
 */
async function getBkashToken() {
    const resp = await fetch(`${envVars.BKASH_BASE_URL}/token/grant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            app_key: envVars.BKASH_APP_KEY,
            app_secret: envVars.BKASH_APP_SECRET,
        }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error("BKASH token error: " + JSON.stringify(data));
    // data.id_token or access_token depends on API
    return data;
}

/**
 * createBkashPayment - create checkout/payment session then return redirect URL
 * This is a simplified flow. Follow bKash guide exactly.
 */
export async function createBkashPayment(paymentId: string, amount: number, bookingId: string) {
    // 1. get token
    const tokenResp = await getBkashToken();
    const bkashToken = tokenResp?.id_token || tokenResp?.access_token;

    // 2. create a payment session on bKash
    const createResp = await fetch(`${envVars.BKASH_BASE_URL}/checkout/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bkashToken}`,
            "X-APP-Key": envVars.BKASH_APP_KEY,
        },
        body: JSON.stringify({
            amount: String(amount),
            intent: "sale",
            merchantInvoiceNumber: paymentId,
            callbackURL: `${envVars.APP_BASE_URL}/api/payments/bkash/webhook`, // bKash will post here
            // optional: other details
        }),
    });

    const createData = await createResp.json();
    if (!createResp.ok) throw new Error("BKASH create error: " + JSON.stringify(createData));

    // createData may contain a URL or a paymentID to redirect user
    const paymentUrl = createData?.bkashURL || `${envVars.BKASH_PAYMENT_UI_BASE}/${createData.paymentID}`;

    // update payment record with provider token/payload
    await prisma.payment.update({
        where: { id: paymentId },
        data: { payload: createData, trxId: createData.paymentID },
    });

    return paymentUrl;
}

/**
 * handleBkashWebhook - bKash will call this on payment success/cancel
 * We expect JSON body contains { paymentID, status, trxId, amount, merchantInvoiceNumber (our paymentId) }
 */
export async function handleBkashWebhook(body: any) {
    const paymentId = body?.merchantInvoiceNumber;
    const status = body?.status; // adapt to bKash payload
    const trxId = body?.trxId ?? body?.paymentID;

    if (!paymentId) throw new Error("Invalid webhook: missing payment id");

    // find payment
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new Error("Payment not found");

    // update payment record
    const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: status === "success" ? "PAID" : "CANCELLED",
            trxId,
            payload: body,
        },
    });

    // update booking on success
    if (status === "success") {
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: "PAID", status: "CONFIRMED" },
        });
    } else if (status === "cancel") {
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: "PENDING", status: "CANCELLED" },
        });
    }

    return updated;
}
