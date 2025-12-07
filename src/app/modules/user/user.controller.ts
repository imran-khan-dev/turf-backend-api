import httpStatus from 'http-status-codes';

import { NextFunction, Request, Response } from "express";
import { PromoteManagerPayload, UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserRole } from '@prisma/client';



const createTurfOwnerHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    throw new Error("Missing required fields");
  }

  const photo = req.file ? req.file.path : undefined;

  const turfOwnerData = { email, password, name, phone, role: UserRole.OWNER, ...(photo && { photo }) };


  const result = await UserService.createTurfOwner(turfOwnerData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User/Owner Created Successfully",
    data: result,
  });
});

const getAllOwnersHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const owners = await UserService.getAllOwners();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All owners fetched successfully",
      data: owners,
    });
  }
);
const createTurfManagerHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { turfUserId } = req.body;
  const ownerId = req.user ? req.user.userId : "";

  const payload: PromoteManagerPayload = { turfUserId, ownerId };
  const result = await UserService.promoteToManager(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Turf User promoted to Manager successfully',
    data: result,
  });
});

const getManagersByTurfProfileHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { turfProfileId } = req.params;

    if (!turfProfileId) {
      throw new Error("TurfProfileId parameter is required");
    }

    const managers = await UserService.getManagersByTurfProfile(turfProfileId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Managers for the turf profile fetched successfully",
      data: managers,
    });
  }
);

const myTrufProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).user;

    console.log("authCheck", auth)
    const result = await UserService.getMyTurfProfile(auth.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My turf profile fetched successfully",
      data: result,
    });
  }
);


export const UserController = {
  createTurfOwnerHandler,
  createTurfManagerHandler,
  getAllOwnersHandler,
  getManagersByTurfProfileHandler,
  myTrufProfile
};
