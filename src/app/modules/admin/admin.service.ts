import { Admin, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";

const createAdmin = async (payload: Prisma.AdminCreateInput): Promise<Admin> => {
    const { email, password, name, phone } = payload;

    // CHECK if admin already exists (global admin level)
    const existingAdmin = await prisma.admin.findUnique({
        where: { email },
    });

    if (existingAdmin) {
        throw new AppError(400, "Admin already exists!");
    }

    // Hash password
    const hashedPassword = await hash(password, Number(envVars.BCRYPT_SALT_ROUND))

    // CREATE admin
    const admin = await prisma.admin.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            // role will be default MANAGER_ADMIN
        },
    });

    return admin;
};

const deleteAdmin = async (email: string): Promise<Admin> => {

    const existingAdmin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!existingAdmin) {
        throw new AppError(400, "Admin not found!");
    }

    const admin = await prisma.admin.delete({
        where: { email },
    });
    return admin;
}
export const AdminService = { createAdmin, deleteAdmin };
