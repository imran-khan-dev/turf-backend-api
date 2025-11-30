import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfUserService } from './turfUser.service';

const createTurfUserHandler = catchAsync(async (req: Request, res: Response) => {
    const turfUserData = req.body;
    const result = await TurfUserService.createTurfUser(turfUserData);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Turf User Created Successfully",
        data: result,
    });
});

export const TurfUserController = { createTurfUserHandler };
