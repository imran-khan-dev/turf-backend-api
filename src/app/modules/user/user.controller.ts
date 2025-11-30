import httpStatus from 'http-status-codes';

import { Request, Response } from "express";
import { PromoteManagerPayload, UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createTurfOwnerHandler = catchAsync(async (req: Request, res: Response) => {
  const turfOwnerData = req.body;
  const result = await UserService.createTurfOwner(turfOwnerData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User/Owner Created Successfully",
    data: result,
  });
});


const createTurfManagerHandler = catchAsync(async (req: Request, res: Response) => {
  const { turfUserId } = req.body;
  const ownerId = req.user?.id as string;



  const payload: PromoteManagerPayload = { turfUserId, ownerId };
  const result = await UserService.promoteToManager(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Turf User promoted to Manager successfully',
    data: result,
  });
});

export const UserController = { createTurfOwnerHandler, createTurfManagerHandler };
