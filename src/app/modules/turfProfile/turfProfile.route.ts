import express from 'express';
import { TurfProfileController } from './turfProfile.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { multerUpload } from '../../config/multer.config';
import { createTurfProfileZodSchema, updateTurfProfileZodSchema } from './turfProfile.validation';

const router = express.Router();

router.post("/create/:id", multerUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "aboutImg", maxCount: 1 },
]),
    validateRequest(createTurfProfileZodSchema),
    TurfProfileController.createTurfProfileHandler);

router.patch("/update/:id", multerUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "aboutImg", maxCount: 1 },
]),
    validateRequest(updateTurfProfileZodSchema),
    TurfProfileController.updateTurfProfileHandler);

export const TurfProfileRoutes = router;
