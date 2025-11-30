import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { prisma } from "../../db";
import { Prisma } from '@prisma/client';

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findUnique({
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


    const payload: Prisma.UserCreateInput = {
      name: "Imran Khan",
      role: "ADMIN",
      email: envVars.ADMIN_EMAIL,
      passwordHash: hashedPassword,
    };

    const admin = await prisma.user.create({
      data: payload
    });
    console.log("Admin Created Successfuly! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
