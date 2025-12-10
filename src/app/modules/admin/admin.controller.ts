import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from './admin.service';
import AppError from '../../errorHelpers/AppError';

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

const deleteAdminHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email) throw new AppError(httpStatus.BAD_REQUEST, 'email is required in params')
        
    const result = await AdminService.deleteAdmin(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Admin deleted successfully",
        data: result,
    });
});

export const AdminController = { createAdminHandler, deleteAdminHandler };
