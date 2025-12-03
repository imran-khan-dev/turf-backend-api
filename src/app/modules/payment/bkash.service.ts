import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../../db";

/** -------------------------------
 *  INTERFACES
 * ------------------------------- */
export interface BkashConfig {
    base_url: string;
    username: string;
    password: string;
    app_key: string;
    app_secret: string;
}

export interface PaymentDetails {
    amount: number;
    callbackURL: string;
    paymentID?: string;
    reference?: string;
    name?: string;
    email?: string;
    userId?: string;
}

/** -------------------------------
 *  CREATE PAYMENT
 * ------------------------------- */
export async function createPayment(
    bkashConfig: BkashConfig,
    paymentDetails: PaymentDetails
) {
    try {


        const { amount, callbackURL, paymentID, reference } = paymentDetails;

        if (!amount || amount < 1) {
            return { statusCode: 400, statusMessage: "Invalid amount" };
        }

        if (!callbackURL) {
            return { statusCode: 400, statusMessage: "callbackURL is required" };
        }

        const response = await axios.post(
            `${bkashConfig.base_url}/tokenized/checkout/create`,
            {
                mode: "0011",
                currency: "BDT",
                intent: "sale",
                amount,
                callbackURL,
                payerReference: reference || "1",
                merchantInvoiceNumber: paymentID || "",
            },
            { headers: await authHeaders(bkashConfig) }
        );

        return response.data;
    } catch (error: any) {
        console.error("Create bKash Payment Error:", error.message);
        return { error: true, message: error.message };
    }
}

/** -------------------------------
 *  EXECUTE PAYMENT
 * ------------------------------- */
export async function executePayment(
    bkashConfig: BkashConfig,
    paymentID: string
) {
    try {
        const response = await axios.post(
            `${bkashConfig.base_url}/tokenized/checkout/execute`,
            { paymentID },
            { headers: await authHeaders(bkashConfig) }
        );

        return response.data;
    } catch (error: any) {
        console.error("bKash Execute Payment Error:", error.message);
        return null;
    }
}

/** -------------------------------
 *  AUTH HEADERS
 * ------------------------------- */
async function authHeaders(bkashConfig: BkashConfig) {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: await grantToken(bkashConfig),
        "x-app-key": bkashConfig.app_key,
    };
}

/** -------------------------------
 *  GET OR REFRESH TOKEN  (PRISMA)
 * ------------------------------- */
async function grantToken(bkashConfig: BkashConfig): Promise<string | null> {
    try {
        const tokenRecord = await prisma.bkash.findFirst({
            orderBy: { createdAt: "desc" },
        });

        const oneHourAgo = new Date(Date.now() - 3600000);

        // Refresh token if older than 1 hour
        if (!tokenRecord || tokenRecord.updatedAt < oneHourAgo) {
            return await setToken(bkashConfig);
        }

        return tokenRecord.authToken;
    } catch (error) {
        console.error("Token lookup failed:", error);
        return null;
    }
}

/** -------------------------------
 *  REQUEST NEW TOKEN (PRISMA)
 * ------------------------------- */
async function setToken(bkashConfig: BkashConfig): Promise<string> {
    const response = await axios.post(
        `${bkashConfig.base_url}/tokenized/checkout/token/grant`,
        {
            app_key: bkashConfig.app_key,
            app_secret: bkashConfig.app_secret,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                username: bkashConfig.username,
                password: bkashConfig.password,
            },
        }
    );

    const idToken = response?.data?.id_token;

    if (idToken) {
        const existing = await prisma.bkash.findFirst();

        if (existing) {
            await prisma.bkash.update({
                where: { id: existing.id },
                data: { authToken: idToken },
            });
        } else {
            await prisma.bkash.create({
                data: { authToken: idToken },
            });
        }
    }

    return idToken;
}
