import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { prisma } from "../../db";
import { Prisma } from '@prisma/client';

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.admin.findUnique({
      where: {
        email: envVars.ADMIN_EMAIL
      }
    });

    if (isAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: Prisma.AdminCreateInput = {
      name: "Imran Khan",
      role: "SUPER_ADMIN",
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      phone: envVars.ADMIN_PHONE
    };

    const admin = await prisma.admin.create({
      data: payload
    });
    console.log("Super Admin Created Successfuly! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
