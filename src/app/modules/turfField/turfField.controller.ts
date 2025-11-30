import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfFieldService } from "./turfField.service";

const createTurfFieldHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TurfFieldService.createTurfField(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Turf Field Created Successfully",
        data: result,
    });
});

export const TurfFieldController = { createTurfFieldHandler };
