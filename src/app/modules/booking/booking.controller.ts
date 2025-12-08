import httpStatus from 'http-status-codes';

import { Request, Response } from "express";
import { generateSlotsForDate } from "../../utils/slotUtils";
import { prisma } from "../../../db";
import { createBookingAndPayment } from "./booking.service";
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


// export const createBooking = async (req: Request, res: Response) => {
//     const { turfProfileId, turfFieldId, startTimeISO, endTimeISO, turfUserId } = req.body;
//     const userId = (req as any).user?.id ?? undefined;

//     console.log("bookingUserId", userId)

//     try {
//         const { booking, payment } = await createBookingAndPayment({
//             turfProfileId,
//             turfFieldId,
//             startTimeISO,
//             endTimeISO,
//             userId,
//             turfUserId,
//         });


//         return res.json({ booking, payment });
//     } catch (err: any) {
//         return res.status(400).json({ message: err.message || "Booking failed" });
//     }
// };

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const { turfProfileId, turfFieldId, startISO, endISO, turfUserId } = req.body;
    const userId = (req as any).user?.id ?? undefined;

    console.log("bookingUserId", userId);

    const result = await createBookingAndPayment({
        turfProfileId,
        turfFieldId,
        startISO,
        endISO,
        userId,
        turfUserId,
    });

    console.log("bookingResult", result)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking created successfully",
        data: result,
    });
});




// export const getBookings = catchAsync(async (req: Request, res: Response) => {
//     const auth = (req as any).user;
//     if (!auth) {
//         return sendResponse(res, {
//             success: false,
//             statusCode: httpStatus.UNAUTHORIZED,
//             message: "Not authenticated",
//             data: null,
//         });
//     }

//     const { bookingId, date } = req.query;
//     let bookings;

//     // 1️⃣ Turf-specific user (customer)
//     if (auth.role === "TURF_USER" && auth.turfUserId) {
//         bookings = await prisma.booking.findMany({
//             where: {
//                 turfUserId: auth.turfUserId,
//                 ...(bookingId ? { id: bookingId.toString() } : {}),
//                 ...(date ? { startTime: { gte: new Date(date.toString()) } } : {}),
//             },
//             include: {
//                 turfField: true,
//                 turfUser: true,
//             },
//             orderBy: { startTime: "asc" },
//         });

//         return sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.OK,
//             message: "Bookings fetched successfully",
//             data: bookings,
//         });
//     }

//     // 2️⃣ Turf owner
//     if (auth.role === "USER" && auth.id) {
//         bookings = await prisma.booking.findMany({
//             where: {
//                 turfField: {
//                     turf: {
//                         ownerId: auth.id,
//                     },
//                 },
//                 ...(bookingId ? { id: bookingId.toString() } : {}),
//                 ...(date ? { startTime: { gte: new Date(date.toString()) } } : {}),
//             },
//             include: {
//                 turfField: true,
//                 user: true,
//                 turfUser: true,
//             },
//             orderBy: { startTime: "asc" },
//         });

//         // 3️⃣ Global user (regular)
//         if (auth.userId) {
//             bookings = await prisma.booking.findMany({
//                 where: {
//                     userId: auth.userId,
//                     ...(bookingId ? { id: bookingId.toString() } : {}),
//                     ...(date ? { startTime: { gte: new Date(date.toString()) } } : {}),
//                 },
//                 include: {
//                     turfField: true,
//                 },
//                 orderBy: { startTime: "asc" },
//             });

//             return sendResponse(res, {
//                 success: true,
//                 statusCode: httpStatus.OK,
//                 message: "Bookings fetched successfully",
//                 data: bookings,
//             });
//         }

//         return sendResponse(res, {
//             success: false,
//             statusCode: httpStatus.NOT_FOUND,
//             message: "No bookings found",
//             data: null,
//         });
//     }
// });

export const getBookings = async (req: Request, res: Response) => {
    const auth = (req as any).user;
    if (!auth) return res.status(401).json({ message: "not authenticated" });

    // if turf user
    if (auth.role === "TURF_USER" && auth.turfUserId) {
        const bookings = await prisma.booking.findMany(
            { where: { turfUserId: auth.turfUserId, turfProfileId: auth.turfProfileId } });
        return res.json(bookings);
    }

    const ownerUserId = auth.userId

    if (ownerUserId) {
        const ownerBookings = await prisma.turfProfile.findUnique({
            where: { ownerId: ownerUserId },
            include: {
                turfItems: {
                    include: {
                        bookings: {
                            include: {
                                user: true,       // If booked by global User
                                turfUser: true,   // If booked by TurfUser
                            },
                        },
                    },
                },
            },
        });


        return res.json(ownerBookings);
    }


    return res.status(403).json({ message: "No bookings found" });
};

export const getBookingById = async (req: Request, res: Response) => {
    const auth = (req as any).user;
    const bookingId = req.params.id;

    if (!auth) return res.status(401).json({ message: "Not authenticated" });

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

    if (!booking) return res.status(404).json({ message: "Booking not found" });


    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking fetched successfully",
        data: booking,
    });
};


export const bookingController = { getFieldSlots, createBooking, getBookings, getBookingById };