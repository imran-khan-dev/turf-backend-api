import { validateRequest } from './../../middlewares/validateRequest';
import express from 'express';
import { TurfFieldController } from './turfField.controller';
import { multerUpload } from '../../config/multer.config';
import { createTurfFieldZodSchema, updateTurfFieldZodSchema } from './turfField.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post("/create", checkAuth("OWNER"), multerUpload.array("photos", 5),
    validateRequest(createTurfFieldZodSchema),
    TurfFieldController.createTurfFieldHandler);

router.patch("/update/:id", checkAuth("OWNER"), multerUpload.array("photos", 5),
    validateRequest(updateTurfFieldZodSchema),
    TurfFieldController.updateTurfFieldHandler);

router.get("/get-fields/:turfProfileId", TurfFieldController.getAllTurfFieldsHandler);



export const TurfFieldRoutes = router;
