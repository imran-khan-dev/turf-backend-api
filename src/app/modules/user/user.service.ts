import { Prisma, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";


const createTurfOwner = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const { email, password, name, phone } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: "OWNER",
    },
  });
};


export const UserService = { createTurfOwner };