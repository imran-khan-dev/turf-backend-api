import express from 'express';
import { TurfProfileController } from './turfProfile.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { multerUpload } from '../../config/multer.config';
import { createTurfProfileSchema } from './turfProfile.validation';

const router = express.Router();

router.post("/create/:id", multerUpload.single("file"),
    validateRequest(createTurfProfileSchema),
    TurfProfileController.createTurfProfileHandler);


export const TurfProfileRoutes = router;
