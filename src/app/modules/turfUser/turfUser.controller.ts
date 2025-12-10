import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfUserService } from './turfUser.service';

const createTurfUserHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        // If file uploaded via multer
        const photo = req.file?.path;

        // Merge form-data + file
        const turfUserData = {
            ...req.body,
            ...(photo && { photo })
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

const updateTurfUserHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const data = {
        turfUserId: id,
        ...req.body,
    };

    // Pass only req.file, NOT req.file.path
    const result = await TurfUserService.updateTurfUserService(data, req.file);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Turf User updated successfully",
        data: result,
    });
});

const allTurfUserHandler = catchAsync(async (req: Request, res: Response) => {
    const { turfProfileId } = req.query as { turfProfileId?: string };

    const users = await TurfUserService.getAllTurfUsers(turfProfileId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Turf Users fetched successfully",
        data: users,
    });
});

const getAllTurfUsersByAdmin = catchAsync(async (req: Request, res: Response) => {
    const users = await TurfUserService.getAllTurfUsersByAdmin();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Turf Users fetched successfully",
        data: users,
    });
})

const deleteTurfUserHandler = catchAsync(async (req: Request, res: Response) => {
    const { turfUserId } = req.params;

    const deletedUser = await TurfUserService.deleteTurfUser(turfUserId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Turf User deleted successfully",
        data: deletedUser,
    });
});


export const TurfUserController = { createTurfUserHandler, updateTurfUserHandler, allTurfUserHandler, deleteTurfUserHandler, getAllTurfUsersByAdmin };
