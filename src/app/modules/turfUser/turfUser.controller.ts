import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfUserService } from './turfUser.service';

const createTurfUserHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        // If file uploaded via multer
        const photo = req.file ? req.file.filename : undefined;

        // Merge form-data + file
        const turfUserData = {
            ...req.body,
            photo,
        };

        const result = await TurfUserService.createTurfUser(turfUserData);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Turf User Created Successfully",
            data: result,
        });
    }
);

export const TurfUserController = { createTurfUserHandler };
