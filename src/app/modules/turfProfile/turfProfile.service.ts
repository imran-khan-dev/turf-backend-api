import { Prisma } from "@prisma/client";
import { prisma } from "../../../db";

const createTurfProfile = async (payload: Prisma.TurfProfileCreateInput) => {
    // Check if owner already has a turf profile
    const existingProfile = await prisma.turfProfile.findUnique({
        where: { ownerId: payload.owner.connect?.id },
    });
    if (existingProfile) {
        throw new Error("This user already owns a Turf Profile");
    }

    return await prisma.turfProfile.create({
        data: payload,
    });
};

export const TurfProfileService = { createTurfProfile };
