// src/modules/payments/payment.routes.ts
import { Router } from "express";
import { createPayment, bkashWebhook } from "./payment.controller";
import bodyParser from "body-parser";

const router = Router();

// create payment session for existing payment
router.post("/:paymentId/create", createPayment);

// bKash webhook - NOTE: bKash may send form-encoded or JSON. Use raw/text parser if needed.
// Use dedicated parser just for this route
router.post("/bkash/webhook", bodyParser.json({ type: "*/*" }), bkashWebhook);

export const PaymentRoutes = router;
