import { Prisma, TurfUser, User, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { cloudinaryUpload, deleteImageFromCLoudinary } from "../../config/cloudinary.confiq";

interface UpdateTurfUserInput {
    turfUserId: string;
    name?: string;
    phone?: string;
    photo?: string;
    address?: string;
    status?: UserStatus;
}

const createTurfUser = async (
    payload: {
        email: string;
        password: string;
        name: string;
        phone: string;
        photo?: string;
        turfProfileSlug: string;
    }
): Promise<TurfUser> => {
    const { email, password, name, phone, photo, turfProfileSlug } = payload;

    const turfProfile = await prisma.turfProfile.findUnique({
        where: { slug: turfProfileSlug },
    });

    if (!turfProfile) throw new Error("Turf Profile not found");

    const turfProfileId = turfProfile.id;


    const existingUser = await prisma.turfUser.findFirst({
        where: { email, turfProfileId },
    });

    if (existingUser) throw new Error("Turf User already exists for this turf");


    const hashedPassword = await hash(password, Number(envVars.BCRYPT_SALT_ROUND));


    const prismaPayload: Prisma.TurfUserCreateInput = {
        email,
        password: hashedPassword,
        name,
        phone,
        photo: photo ? photo : undefined,
        turf: { connect: { id: turfProfileId } }, // This matches Prisma type
    };


    const turfUser = await prisma.turfUser.create({ data: prismaPayload });

    return turfUser;
};

const updateTurfUserService = async (
    data: UpdateTurfUserInput,
    file?: Express.Multer.File
): Promise<TurfUser> => {
    const { turfUserId, ...updateData } = data;

    const existingUser = await prisma.turfUser.findUnique({
        where: { id: turfUserId },
    });

    if (!existingUser) throw new AppError(404, "Turf user not found");

    if (file) {
        if (existingUser.photo) {
            await deleteImageFromCLoudinary(existingUser.photo);
        }

        const uploaded = await cloudinaryUpload.uploader.upload(file.path, {
            folder: "turf_users",
        });

        updateData.photo = uploaded.secure_url;
    }

    return await prisma.turfUser.update({
        where: { id: turfUserId },
        data: updateData,
    });
};

const getAllTurfUsers = async (turfProfileId?: string): Promise<Partial<TurfUser>[]> => {
    const whereClause = turfProfileId
        ? { turfProfileId, isDeleted: false }
        : { isDeleted: false };

    const users = await prisma.turfUser.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            status: true,
            turfProfileId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return users;
};

const getAllTurfUsersByAdmin = async () => {
    const users = await prisma.turfUser.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            photo: true,
            status: true,
            createdAt: true,
            updatedAt: true,

            turf: {
                select: {
                    slug: true,
                },
            },
        },
    });

    return users;
};



const deleteTurfUser = async (turfUserId: string): Promise<TurfUser> => {
    const existingUser = await prisma.turfUser.findUnique({
        where: { id: turfUserId },
    });

    if (!existingUser || existingUser.isDeleted) {
        throw new AppError(404, "Turf user not found");
    }

    // Soft delete
    return prisma.turfUser.update({
        where: { id: turfUserId },
        data: { isDeleted: true },
    });
};


export const TurfUserService = { createTurfUser, updateTurfUserService, getAllTurfUsers, deleteTurfUser, getAllTurfUsersByAdmin };
