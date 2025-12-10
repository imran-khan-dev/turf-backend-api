import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfFieldService } from "./turfField.service";
import { prisma } from '../../../db';

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

const getFieldHandler = catchAsync(async (req: Request, res: Response) => {
    
        const fieldId = req.params.id as string;

        if (!fieldId) throw new Error("fieldId is required in params");
        const turfField = await prisma.turfField.findUnique({
            where: { id: fieldId },
            include: { turf: true },
        });
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Turf Field fetched successfully",
            data: turfField,
        });
})

const getAllTurfFieldsHandler = catchAsync(async (req: Request, res: Response) => {
    const turfProfileId = req.params.turfProfileId as string;
    if (!turfProfileId) throw new Error("turfProfileId is required in params");
    const turfFields = await prisma.turfField.findMany({
        where: { turfProfileId },
        include: { turf: true },
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Turf Fields fetched successfully",
        data: turfFields,
    });
})

export const TurfFieldController = { createTurfFieldHandler, updateTurfFieldHandler, getAllTurfFieldsHandler, getFieldHandler };


