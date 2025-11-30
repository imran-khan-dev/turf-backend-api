import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TurfProfileService } from './turfProfile.service';

const createTurfProfileHandler = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    // Owner ID must come from req.user.id via JWT after authentication!
    const ownerId = req.params.id; // temporary (for now)

    if (!ownerId) {
        throw new Error("Unauthorized. Owner ID is missing.");
    }

    // 🔹 Extract Data + File
    const body = req.body;
    const file = req.file;

    console.log("FORM DATA:", body);
    console.log("FILE:", file?.path);

    // 🔹 Attach uploaded image to body (Cloudinary URL)
    if (file?.path) {
        body.logo = file.path;
    }

    // 🔹 Create payload for Prisma
    const payload = {
        slug: body.slug,
        name: body.name,
        logo: body.logo || undefined,

        // 🔹 RELATION -
        owner: { connect: { id: ownerId } }, // <— this is correct

        // OPTIONAL DATA (form-data sends all as strings)
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

    // 🔹 Call Service
    const result = await TurfProfileService.createTurfProfile(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Turf Profile Created Successfully",
        data: result,
    });
});


export const TurfProfileController = { createTurfProfileHandler };
