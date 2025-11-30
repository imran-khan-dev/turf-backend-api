import httpStatus  from 'http-status-codes';

import { Request, Response } from "express";
import { UserService } from "./user.service"; 
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

export const UserController = { createTurfOwnerHandler };
