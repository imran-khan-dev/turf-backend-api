import { prisma } from "../../../db";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";


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


export async function createBookingAndPayment({
    turfProfileId,
    turfFieldId,
    startISO,
    endISO,
    userId,
    turfUserId,
}: {
    turfProfileId: string;
    turfFieldId: string;
    startISO: string;
    endISO: string;
    userId?: string;
    turfUserId?: string;
}) {
    return await prisma.$transaction(async (tx) => {
        const conflict = await tx.booking.findFirst({
            where: {
                turfFieldId,
                OR: [
                    {
                        startTime: { lt: new Date(endISO) },
                        endTime: { gt: new Date(startISO) },
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

        if (turfFieldId === null) throw new AppError(404, "Turf field not found");

        const turfField = await tx.turfField.findUnique({ where: { id: turfFieldId, turfProfileId } });
        if (!turfField) throw new AppError(404, "Turf field not found");

        const paymentAmount = turfField.pricePerSlot as number;

        // Create booking
        const booking = await tx.booking.create({
            data: {
                turfProfileId,
                turfFieldId,
                userId: userId ?? null,
                turfUserId: turfUserId ?? null,
                startTime: new Date(startISO),
                endTime: new Date(endISO),
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
