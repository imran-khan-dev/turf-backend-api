// // src/modules/payments/payment.controller.ts
// import { Request, Response } from "express";
// import { createBkashPayment, handleBkashWebhook } from "./bkash.service";
// import { prisma } from "../../../db";

// /**
//  * POST /api/payments/:paymentId/create
//  * (optional) you can call this separately if you created booking earlier
//  */


// export const createPayment = async (req: Request, res: Response) => {
//   const { paymentId } = req.params;
//   const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
//   if (!payment) return res.status(404).json({ message: "Payment not found" });

//   const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
//   if (!booking) return res.status(404).json({ message: "Booking not found" });

//   const paymentUrl = await createBkashPayment(paymentId, payment.amount, booking.id);
//   return res.json({ paymentUrl });
// };

// /**
//  * POST /api/payments/bkash/webhook
//  * bKash will POST here after payment
//  */
// export const bkashWebhook = async (req: Request, res: Response) => {
//   try {
//     const body = req.body;
//     await handleBkashWebhook(body);
//     // always respond 200 quickly
//     res.status(200).send("OK");
//   } catch (err: any) {
//     console.error("bkash webhook error", err);
//     res.status(500).send("ERROR");
//   }
// };
