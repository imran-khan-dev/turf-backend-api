import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfProfileService } from './turfProfile.service';

const createTurfProfileHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const ownerId = req.user?.id;  // MUST COME FROM JWT
    const ownerId = req.params.id;

    if (!ownerId) throw new Error("Unauthorized. Owner ID is missing.");

    const payload = {
        ...req.body,
        owner: { connect: { id: ownerId } }, // RELATION
    };

    const result = await TurfProfileService.createTurfProfile(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Turf Profile Created Successfully",
        data: result,
    });
});

export const TurfProfileController = { createTurfProfileHandler };
