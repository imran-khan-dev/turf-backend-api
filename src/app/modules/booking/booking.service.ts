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
    user }: {
        turfProfileId: string;
        turfFieldId: string;
        startISO: string;
        endISO: string;
        user?: any;
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

        if (user) {
            payerUserId = user.userId;
            payerUserName = user.name;
            payerUserEmail = user.email;

        }
        // } else if (turfUserId) {
        //     const turfUser = await tx.turfUser.findUnique({ where: { id: turfUserId } });
        //     if (turfUser) {
        //         payerUserId = turfUser.userId;
        //         payerUserName = turfUser.name;
        //         payerUserEmail = turfUser.email;
        //     }
        // }




        if (turfFieldId === null) throw new AppError(404, "Turf field not found");

        const turfField = await tx.turfField.findUnique({ where: { id: turfFieldId, turfProfileId } });
        if (!turfField) throw new AppError(404, "Turf field not found");

        const paymentAmount = turfField.pricePerSlot as number;

        // Create booking
        const booking = await tx.booking.create({
            data: {
                turfProfileId,
                turfFieldId,
                userId: user.role === "OWNER" || user.role === "MANAGER" ? user.userId : null,
                turfUserId: user.role === "TURF_USER" ? user.userId : null,
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




interface BookingFilters {
    status?: string;
    startDate?: string;
    endDate?: string;
    turfFieldId?: string;
    page?: number;
    limit?: number;
}

export const getBookingsService = async (
    auth: any,
    filters: BookingFilters
) => {
    const { status, startDate, endDate, turfFieldId, page = 1, limit = 20 } = filters;

    const baseWhere: any = {};
    if (status) baseWhere.status = status;
    if (startDate || endDate) {
        baseWhere.startTime = {};
        if (startDate) baseWhere.startTime.gte = new Date(startDate);
        if (endDate) baseWhere.startTime.lte = new Date(endDate);
    }
    // if (turfFieldId) baseWhere.turfFieldId = turfFieldId;

    console.log("AuthRole", auth)

    console.log('checkBase', baseWhere)
    console.log("authField", auth.turfProfileId)


    // --- Turf User Logic ---
    if (auth.role === "TURF_USER" && auth.userId) {
        const bookings = await prisma.booking.findMany({
            where: {
                turfUserId: auth.userId,
                turfProfileId: auth.turfProfileId,
                // ...baseWhere,
            },
            include: {
                turfField: true,
                user: true,
                turfUser: true,
                payment: true,
            },
            // take: limit,
            // skip: (page - 1) * limit,
            orderBy: { startTime: "desc" },
        });

        console.log("turfUserBooking", bookings)
        const total = await prisma.booking.count({
            where: {
                turfUserId: auth.turfUserId,
                turfProfileId: auth.turfProfileId,
                ...baseWhere,

            },


        });

        console.log("turfUserBook", bookings)
        return { bookings, total };
    }

    // --- Owner Logic ---
    if (auth.userId) {
        const ownerProfiles = await prisma.turfProfile.findMany({
            where: { ownerId: auth.userId },
            include: {
                turfItems: {
                    include: {
                        bookings: {
                            where: baseWhere,
                            include: {
                                user: true,
                                turfUser: true,
                                turfField: true,
                            },
                            orderBy: { startTime: "desc" },
                        },
                    },
                },
            },
        });

        // Flatten all bookings from multiple turfItems
        const bookings = ownerProfiles.flatMap((profile) =>
            profile.turfItems.flatMap((item) => item.bookings)
        );

        return { bookings, total: bookings.length };
    }

    throw new Error("User role not recognized for booking fetch");
};

