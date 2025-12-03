
// src/modules/bookings/booking.controller.ts
import { Request, Response } from "express";
import { generateSlotsForDate } from "../../utils/slotUtils";
import { prisma } from "../../../db";
import { checkAvailability, createBookingAndPayment } from "./booking.service";
import { envVars } from "../../config/env";

/**
 * GET /api/fields/:fieldId/slots?date=2025-12-03
 * returns slots for that day with status AVAILABLE|BOOKED|PAST
 */
export const getFieldSlots = async (req: Request, res: Response) => {
    const { fieldId } = req.params;
    const { date } = req.query; // expect YYYY-MM-DD

    if (!date) return res.status(400).json({ message: "date query required (YYYY-MM-DD)" });

    // get turf field and parent turf profile to read hours and slot duration
    const field = await prisma.turfField.findUnique({
        where: { id: fieldId },
    });
    if (!field) return res.status(404).json({ message: "Field not found" });

    // fallback hours — prefer field.openHour/closeHour, else set default
    const startHour = (field as any).openHour ?? "08:00";
    const endHour = (field as any).closeHour ?? "23:00";
    const slotDuration = field.slotDuration ?? 90;

    const slots = generateSlotsForDate(String(date), startHour, endHour, slotDuration);

    // fetch bookings for that field on that day
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(new Date(dayStart).setDate(dayStart.getDate() + 1));

    const bookings = await prisma.booking.findMany({
        where: {
            turfFieldId: fieldId,
            startTime: { gte: dayStart },
            endTime: { lte: dayEnd },
            status: { in: ["PENDING", "CONFIRMED"] },
        },
    });

    // map bookings to slots -> mark BOOKED if overlapping
    const enriched = slots.map(slot => {
        const overlapped = bookings.some(b =>
            !(new Date(slot.endISO) <= b.startTime || new Date(slot.startISO) >= b.endTime)
        );
        return { ...slot, status: overlapped ? "BOOKED" : slot.status };
    });

    return res.json(enriched);
};

/**
 * Body: { turfProfileId, turfFieldId, startTimeISO, endTimeISO, paymentAmount, turfUserId? , userId? }
 */
export const createBooking = async (req: Request, res: Response) => {
    const { turfProfileId, turfFieldId, startTimeISO, endTimeISO, paymentAmount, turfUserId } = req.body;
    // if user is a global user, you may read req.user (decoded) for userId
    const userId = (req as any).user?.id ?? undefined;

    try {
        const { booking, payment } = await createBookingAndPayment({
            turfProfileId,
            turfFieldId,
            startTimeISO,
            endTimeISO,
            paymentAmount,
            userId,
            turfUserId,
        });

        // create a bKash payment session for this payment and return payment URL
        // import payment service

        // const paymentUrl = await createBkashPayment(payment.id, paymentAmount, booking.id);

        return res.json({ booking, payment });
    } catch (err: any) {
        return res.status(400).json({ message: err.message || "Booking failed" });
    }
};

/**
 * GET /api/bookings/my
 */
export const getMyBookings = async (req: Request, res: Response) => {
    const auth = (req as any).user;
    console.log("getBookings", auth)
    if (!auth) return res.status(401).json({ message: "not authenticated" });

    // if turf user
    if (auth.role === "TURF_USER" && auth.turfUserId) {
        const bookings = await prisma.booking.findMany(
            { where: { turfUserId: auth.turfUserId, turfProfileId: auth.turfProfileId } });
        return res.json(bookings);
    }

    // global user
    if (auth.userId) {
        const bookings = await prisma.booking.findMany({ where: { userId: auth.userId } });
        return res.json(bookings);
    }

    return res.status(403).json({ message: "No bookings found" });
};
