import { validateRequest } from './../../middlewares/validateRequest';
import express from 'express';
import { TurfFieldController } from './turfField.controller';
import { multerUpload } from '../../config/multer.config';
import { createTurfFieldZodSchema } from './turfField.validation';

const router = express.Router();

router.post("/create", multerUpload.array("photos", 5), 
validateRequest(createTurfFieldZodSchema), 
TurfFieldController.createTurfFieldHandler);

export const TurfFieldRoutes = router;
