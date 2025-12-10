import httpStatus from 'http-status-codes';

import { Request, Response } from "express";
import { generateSlotsForDate } from "../../utils/slotUtils";
import { prisma } from "../../../db";
import { createBookingAndPayment, getBookingsService } from "./booking.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


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



export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const { turfProfileId, turfFieldId, startISO, endISO } = req.body;

    const user = (req as any).user


    const result = await createBookingAndPayment({
        turfProfileId,
        turfFieldId,
        startISO,
        endISO,
        user,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking created successfully",
        data: result,
    });
});



// export const getBookings = async (req: Request, res: Response) => {
//     const auth = (req as any).user;
//     if (!auth) return res.status(401).json({ message: "not authenticated" });

//     // if turf user
//     if (auth.role === "TURF_USER" && auth.turfUserId) {
//         const bookings = await prisma.booking.findMany(
//             { where: { turfUserId: auth.turfUserId, turfProfileId: auth.turfProfileId } });
//         return res.json(bookings);
//     }

//     const ownerUserId = auth.userId

//     if (ownerUserId) {
//         const ownerBookings = await prisma.turfProfile.findUnique({
//             where: { ownerId: ownerUserId },
//             include: {
//                 turfItems: {
//                     include: {
//                         bookings: {
//                             include: {
//                                 user: true,       // If booked by global User
//                                 turfUser: true,   // If booked by TurfUser
//                             },
//                         },
//                     },
//                 },
//             },
//         });


//         return res.json(ownerBookings);
//     }


//     return res.status(403).json({ message: "No bookings found" });
// };

export const getBookingById = async (req: Request, res: Response) => {
    const bookingId = req.params.id;

    if (!bookingId) return res.status(400).json({ message: "Booking ID required" });

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            turfField: true,
            user: true,
            turfUser: true,
            payment: true,
        },
    });

    console.log("AzadBook", booking)

    if (!booking) return res.status(404).json({ message: "Booking not found" });


    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking fetched successfully",
        data: booking,
    });
};


export const getBookings = async (req: Request, res: Response) => {
    try {
        const auth = (req as any).user;
        if (!auth) return res.status(401).json({ message: "Not authenticated" });

        // Extract query parameters
        const { status, startDate, endDate, turfFieldId, page, limit } = req.query;

        const filters = {
            status: status as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            turfFieldId: turfFieldId as string | undefined,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        };

        const result = await getBookingsService(auth, filters);

        res.json({ success: true, data: result });
    } catch (err: any) {
        console.error("getBookingsController error:", err);
        res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};





export const bookingController = { getFieldSlots, createBooking, getBookings, getBookingById };