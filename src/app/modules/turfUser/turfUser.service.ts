import { Prisma, TurfUser } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";

const createTurfUser = async (
    payload: {
        email: string;
        password: string;
        name: string;
        phone: string;
        photo?: string;
        turfProfileId: string; 
    }
): Promise<TurfUser> => {
    const { email, password, name, phone, photo, turfProfileId } = payload;


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


// const createTurfUser = async (payload: TurfUserInput) => {

//     // Convert string boolean & numbers properly
//     const finalPayload = {
//       ...payload,
//       phone: String(payload.phone),
//       status: payload.status ? payload.status : "ACTIVE",
//       turf: { connect: { id: payload.turfProfileId } },
//       photo: payload.photo ?? undefined,
//     };

//     const result = await prisma.turfUser.create({
//       data: finalPayload,
//     });

//     return result;
//   }

export const TurfUserService = { createTurfUser };
