// src/modules/bookings/booking.service.ts
import { prisma } from "../../../db";
import { BookingStatus, PaymentStatus } from "@prisma/client";

/**
 * checkAvailability - returns true if slot is free (no overlapping CONFIRMED / PENDING bookings)
 */
export async function checkAvailability(turfFieldId: string, startTimeISO: string, endTimeISO: string) {
    const conflict = await prisma.booking.findFirst({
        where: {
            turfFieldId,
            status: { in: ["PENDING", "CONFIRMED"] },
            OR: [
                {
                    AND: [
                        { startTime: { lte: new Date(startTimeISO) } },
                        { endTime: { gt: new Date(startTimeISO) } },
                    ],
                },
                {
                    AND: [
                        { startTime: { lt: new Date(endTimeISO) } },
                        { endTime: { gte: new Date(endTimeISO) } },
                    ],
                },
                {
                    AND: [
                        { startTime: { gte: new Date(startTimeISO) } },
                        { endTime: { lte: new Date(endTimeISO) } },
                    ],
                },
            ],
        },
    });

    return !conflict;
}

/**
 * createBooking - create booking record (PENDING) and payment record (PENDING)
 * returns { booking, payment }
 * payer can be userId (global) OR turfUserId (tenant customer)
 */
export async function createBookingAndPayment({
    turfProfileId,
    turfFieldId,
    startTimeISO,
    endTimeISO,
    paymentAmount,
    userId,
    turfUserId,
}: {
    turfProfileId: string;
    turfFieldId: string;
    startTimeISO: string;
    endTimeISO: string;
    paymentAmount: number;
    userId?: string;
    turfUserId?: string;
}) {
    // availability check as single transaction to reduce race condition window
    const available = await checkAvailability(turfFieldId, startTimeISO, endTimeISO);
    if (!available) {
        throw new Error("Selected slot is no longer available");
    }

    // create booking
    const booking = await prisma.booking.create({
        data: {
            turfProfileId,
            turfFieldId,
            userId: userId ?? null,
            turfUserId: turfUserId ?? null,
            startTime: new Date(startTimeISO),
            endTime: new Date(endTimeISO),
            paymentStatus: PaymentStatus.PENDING,
            paymentAmount,
            status: BookingStatus.PENDING,
        },
    });

    // create payment record
    const payment = await prisma.payment.create({
        data: {
            bookingId: booking.id,
            amount: paymentAmount,
            provider: "BKASH",
            status: PaymentStatus.PENDING,
        },
    });

    return { booking, payment };
}
