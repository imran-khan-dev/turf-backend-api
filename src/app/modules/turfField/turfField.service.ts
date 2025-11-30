import { Prisma } from "@prisma/client";
import { prisma } from "../../../db";

const createTurfField = async (payload: Prisma.TurfFieldCreateInput) => {

    // Validate turfProfileId - must exist before creating field
    const turfProfile = await prisma.turfProfile.findUnique({
        where: { id: payload.turf.connect?.id },
    });

    if (!turfProfile) {
        throw new Error("Invalid turfProfileId — Turf Profile not found");
    }

    // Create Turf Field
    return await prisma.turfField.create({
        data: payload,
    });
};

export const TurfFieldService = { createTurfField };
