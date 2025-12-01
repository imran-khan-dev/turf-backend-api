import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfFieldService } from "./turfField.service";

const createTurfFieldHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, pricePerSlot, slotDuration, available, turfProfileId } = req.body;

        let photos: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            photos = req.files.map((file: any) => file.path);
        }

        const payload = {
            turf: { connect: { id: turfProfileId } }, // relation
            name,
            pricePerSlot: Number(pricePerSlot),
            slotDuration: slotDuration ? Number(slotDuration) : 90, // default 90 min
            available: available,
            photos,
        };

        const result = await TurfFieldService.createTurfField(payload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Turf Field Created Successfully",
            data: result,
        });
    });



const updateTurfFieldHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const turfFieldId = req.params.id;
        if (!turfFieldId) throw new Error("turfFieldId is required in params");

        const bodyData = req.body;
        let newPhotos: string[] = [];

        // multiple files uploaded
        if (req.files && Array.isArray(req.files)) {
            newPhotos = req.files.map((file: any) => file.path);
        }

        const updatedField = await TurfFieldService.updateTurfField({
            turfFieldId,
            data: bodyData,
            newPhotos,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Turf Field updated successfully",
            data: updatedField,
        });
    }
);

export const TurfFieldController = { createTurfFieldHandler, updateTurfFieldHandler };


