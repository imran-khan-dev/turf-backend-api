import { Prisma } from "@prisma/client";
import { prisma } from "../../../db";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.confiq";

interface UpdateTurfFieldInput {
    turfFieldId: string;
    data: Partial<Prisma.TurfFieldUpdateInput>;
    newPhotos?: string[];
}

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


const updateTurfField = async (payload: UpdateTurfFieldInput) => {
    const { turfFieldId, data, newPhotos } = payload;

    // Check if TurfField exists
    const existingField = await prisma.turfField.findUnique({
        where: { id: turfFieldId },
    });

    if (!existingField) {
        throw new Error("Turf Field not found");
    }

    const updateData: Prisma.TurfFieldUpdateInput = { ...data };

    // If new photos uploaded → delete old + replace
    if (newPhotos && newPhotos.length > 0) {
        if (existingField.photos) {
            for (const oldPhoto of existingField.photos) {
                await deleteImageFromCLoudinary(oldPhoto); // safely delete
            }
        }
        updateData.photos = newPhotos; // save new photos
    }

    // Update Turf Field
    return await prisma.turfField.update({
        where: { id: turfFieldId },
        data: updateData,
    });
};


export const TurfFieldService = { createTurfField, updateTurfField };
