import { validateRequest } from './../../middlewares/validateRequest';
import express from 'express';
import { TurfFieldController } from './turfField.controller';
import { multerUpload } from '../../config/multer.config';
import { createTurfFieldZodSchema, updateTurfFieldZodSchema } from './turfField.validation';

const router = express.Router();

router.post("/create", multerUpload.array("photos", 5),
    validateRequest(createTurfFieldZodSchema),
    TurfFieldController.createTurfFieldHandler);

router.patch("/update/:id", multerUpload.array("photos", 5),
    validateRequest(updateTurfFieldZodSchema),
    TurfFieldController.updateTurfFieldHandler);

export const TurfFieldRoutes = router;
