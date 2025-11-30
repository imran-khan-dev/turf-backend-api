import { Prisma, TurfUser } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";

const createTurfUser = async (payload: {
    email: string;
    password: string;
    name: string;
    phone: string;
    turfProfileId: string;
}): Promise<TurfUser> => {
    const { email, password, name, phone, turfProfileId } = payload;

    // Check if TurfUser with the same email exists in this turf
    const existingUser = await prisma.turfUser.findFirst({
        where: { email, turfProfileId },
    });

    if (existingUser) throw new Error("Turf User already exists for this turf");

    const hashedPassword = await hash(password, Number(envVars.BCRYPT_SALT_ROUND));

    const turfUser = await prisma.turfUser.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            turf: { connect: { id: turfProfileId } }, // connect relation
        },
    });

    return turfUser;
};

export const TurfUserService = { createTurfUser };
