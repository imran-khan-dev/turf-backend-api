import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfProfileService } from './turfProfile.service';
import AppError from '../../errorHelpers/AppError';

const createTurfProfileHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const ownerId = req.user ? req.user.userId : "";
    const ownerId = req.user ? (req.user as { userId: string }).userId : "";

    if (!ownerId) {
        throw new AppError(401, "Unauthorized. Owner ID is missing.");
    }

    const body = req.body;
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };

    // Attach uploaded images
    if (files.logo?.[0]) body.logo = files.logo[0].path;
    if (files.heroImage?.[0]) body.heroImage = files.heroImage[0].path;
    if (files.aboutImg?.[0]) body.aboutImg = files.aboutImg[0].path;


    // Create payload for Prisma
    const payload = {
        slug: body.slug,
        name: body.name,
        logo: body.logo || undefined,
        owner: { connect: { id: ownerId } },
        email: body.email || undefined,
        phone: body.phone || undefined,
        openHours: body.openHours || undefined,
        facebookLink: body.facebookLink || undefined,
        instagramLink: body.instagramLink || undefined,
        whatsappLink: body.whatsappLink || undefined,
        heroImage: body.heroImage || undefined,
        heroTitle: body.heroTitle || undefined,
        aboutTitle: body.aboutTitle || undefined,
        aboutDesc: body.aboutDesc || undefined,
        aboutImg: body.aboutImg || undefined,
        address: body.address || undefined,
        googleMapLink: body.googleMapLink || undefined,
        footerText: body.footerText || undefined,
    };

    const result = await TurfProfileService.createTurfProfile(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Turf Profile Created Successfully",
        data: result,
    });
});

const updateTurfProfileHandler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const turfProfileId = req.params.id;

        if (!turfProfileId) throw new Error("TurfProfileId parameter is required");

        // Files sent via multer
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // Data sent via form-data
        const bodyData = req.body;

        const updatedProfile = await TurfProfileService.updateTurfProfile({
            turfProfileId,
            data: bodyData,
            files,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Turf Profile updated successfully",
            data: updatedProfile,
        });
    }
);

const getTurfProfileHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { slug, id } = req.params;

        if (!slug && !id) {
            throw new Error("Turf profile slug or id is required");
        }

        const turfProfile = await TurfProfileService.getTurfProfile({
            slug,
            id,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Turf Profile fetched successfully",
            data: turfProfile,
        });
    }
);

export const TurfProfileController = { createTurfProfileHandler, updateTurfProfileHandler, getTurfProfileHandler };
