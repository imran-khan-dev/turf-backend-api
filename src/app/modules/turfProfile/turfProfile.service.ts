import { Prisma, TurfProfile } from "@prisma/client";
import { prisma } from "../../../db";
import AppError from "../../errorHelpers/AppError";
import { cloudinaryUpload, deleteImageFromCLoudinary } from "../../config/cloudinary.confiq";


interface UpdateTurfProfileInput {
    turfProfileId: string;
    data: Partial<Prisma.TurfProfileUpdateInput>;
    files?: { [fieldname: string]: Express.Multer.File[] };
}

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


const updateTurfProfile = async (payload: UpdateTurfProfileInput): Promise<Partial<TurfProfile>> => {
    const { turfProfileId, data, files } = payload;

    // Check if TurfProfile exists
    const existingProfile = await prisma.turfProfile.findUnique({
        where: { id: turfProfileId },
    });
    if (!existingProfile) throw new AppError(404, "Turf Profile not found");

    const updateData: Prisma.TurfProfileUpdateInput = { ...data };

    // Handle file uploads & replace old images
    if (files) {
        const fileFields = ["logo", "heroImage", "aboutImg"] as const;

        for (const field of fileFields) {
            const fileArray = files[field];
            if (fileArray && fileArray.length > 0) {
                // Delete old image
                if (existingProfile[field]) {
                    await deleteImageFromCLoudinary(existingProfile[field]!);
                }

                // Upload new image to Cloudinary
                const uploaded = await cloudinaryUpload.uploader.upload(fileArray[0].path, {
                    folder: "turf_profiles",
                });

                updateData[field] = uploaded.secure_url;
            }
        }
    }

    // Update only modified fields
    const updatedProfile = await prisma.turfProfile.update({
        where: { id: turfProfileId },
        data: updateData,
    });

    return updatedProfile;
};

export const TurfProfileService = { createTurfProfile, updateTurfProfile };
