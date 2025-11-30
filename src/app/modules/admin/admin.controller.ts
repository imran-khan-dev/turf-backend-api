import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from './admin.service';

const createAdminHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const adminData = req.body;
    const result = await AdminService.createAdmin(adminData);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Admin Created Successfully",
        data: result,
    });
});

export const AdminController = { createAdminHandler };
