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
    return await prisma.$transaction(async (tx) => {
        const conflict = await tx.booking.findFirst({
            where: {
                turfFieldId,
                OR: [
                    {
                        startTime: { lt: new Date(endTimeISO) },
                        endTime: { gt: new Date(startTimeISO) },
                    },
                ],
            },
        });

        if (conflict) throw new Error("Selected slot is no longer available");

        // Fetch user info if available
        let payerUserId: string | null = null;
        let payerUserName: string | null = null;
        let payerUserEmail: string | null = null;

        if (userId) {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (user) {
                payerUserId = user.id;
                payerUserName = user.name;
                payerUserEmail = user.email;
            }
        } else if (turfUserId) {
            const turfUser = await tx.turfUser.findUnique({ where: { id: turfUserId } });
            if (turfUser) {
                payerUserId = turfUser.id;
                payerUserName = turfUser.name;
                payerUserEmail = turfUser.email;
            }
        }

        // Create booking
        const booking = await tx.booking.create({
            data: {
                turfProfileId,
                turfFieldId,
                userId: userId ?? null,
                turfUserId: turfUserId ?? null,
                startTime: new Date(startTimeISO),
                endTime: new Date(endTimeISO),
                paymentAmount,
                paymentStatus: PaymentStatus.PENDING,
                status: BookingStatus.PENDING,
            },
        });

        // Create payment with user info
        const payment = await tx.payment.create({
            data: {
                bookingId: booking.id,
                amount: paymentAmount,
                status: PaymentStatus.PENDING,
                payerId: payerUserId,
                payerName: payerUserName,
                payerEmail: payerUserEmail,
            },
        });

        return { booking, payment };
    });
}
