import { Prisma, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "../../../db";
import { envVars } from "../../config/env";

export interface PromoteManagerPayload {
  turfUserId: string;
  ownerId: string;
}

const createTurfOwner = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const { email, password, name, phone, photo } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, Number(envVars.BCRYPT_SALT_ROUND));

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      photo,
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

  if (existingUser && existingUser.role === "MANAGER") {
    throw new Error("Turf user is already a manager");
  }

  const [newManager] = await prisma.$transaction(async (prismaTx) => {
    const manager = await prismaTx.user.create({
      data: {
        email: turfUser.email,
        password: turfUser.password || "",
        name: turfUser.name,
        phone: turfUser.phone,
        photo: turfUser.photo || "",
        role: "MANAGER",
        promotedTurfUser: { connect: { id: turfUser.id } },
      },
    });

    await prismaTx.turfManager.create({
      data: {
        userId: manager.id,
        turfProfileId: turfUser.turfProfileId,
      },
    });

    await prismaTx.turfUser.update({
      where: { id: turfUser.id },
      data: { appUserId: manager.id },
    });

    return [manager];
  });

  return newManager;
};


const getAllOwners = async (): Promise<
  {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    turfProfileIds: string[];
  }[]
> => {
  const owners = await prisma.user.findMany({
    where: { role: "OWNER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      turfProfiles: {
        select: { id: true },
      },
    },
  });

  return owners.map((owner) => ({
    ...owner,
    turfProfileIds: owner.turfProfiles ? [owner.turfProfiles.id] : [],
    turfProfiles: undefined,
  }));
};


const getManagersByTurfProfile = async (
  turfProfileId: string
): Promise<
  {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    turfProfileIds: string[];
  }[]
> => {
  const managers = await prisma.user.findMany({
    where: {
      role: "MANAGER",
      turfManagers: { some: { turfProfileId } },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      turfManagers: {
        select: { turfProfileId: true },
      },
    },
  });

  return managers.map((manager) => ({
    ...manager,
    turfProfileIds: manager.turfManagers.map((tm) => tm.turfProfileId),
    turfManagers: undefined,
  }));
};

export const UserService = {
  createTurfOwner,
  promoteToManager,
  getAllOwners,
  getManagersByTurfProfile,
};
