import { Prisma, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";


export interface PromoteManagerPayload {
  turfUserId: string;
  ownerId: string;
}

const createTurfOwner = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const { email, password, name, phone } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, envVars.BCRYPT_SALT_ROUND);

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


const promoteToManager = async (
  payload: PromoteManagerPayload
): Promise<User> => {
  const { turfUserId, ownerId } = payload;


  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== "OWNER") throw new Error("Owner not found or invalid");


  const turfUser = await prisma.turfUser.findUnique({ where: { id: turfUserId } });
  if (!turfUser) throw new Error("Turf user not found");


  const existingUser = await prisma.user.findFirst({
    where: { promotedTurfUser: { id: turfUserId } },
  });

  if (existingUser) {
    if (existingUser.role === "MANAGER") {
      throw new Error("Turf user is already a manager");
    }
  }

  // Perform all DB operations in a transaction
  const [newManager] = await prisma.$transaction(async (prismaTx) => {

    // Create global User
    const manager = await prismaTx.user.create({
      data: {
        email: turfUser.email,
        password: turfUser.password || "", // use existing hashed password
        name: turfUser.name,
        phone: turfUser.phone,
        role: "MANAGER",
        promotedTurfUser: { connect: { id: turfUser.id } },
      },
    });

    // Create TurfManager entry
    await prismaTx.turfManager.create({
      data: {
        userId: manager.id,
        turfProfileId: turfUser.turfProfileId,
      },
    });

    // Update TurfUser to reference new global user
    await prismaTx.turfUser.update({
      where: { id: turfUser.id },
      data: { appUserId: manager.id },
    });

    return [manager];
  });

  return newManager;
};

export const UserService = { createTurfOwner, promoteToManager };