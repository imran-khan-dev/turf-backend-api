import express from 'express';
import { TurfUserController } from './turfUser.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfUserZodSchema, updateTurfUserZodSchema } from './turfUser.validation';

const router = express.Router();

router.post("/register", multerUpload.single("file"), validateRequest(createTurfUserZodSchema), TurfUserController.createTurfUserHandler);
router.patch("/update/:id", multerUpload.single("file"), validateRequest(updateTurfUserZodSchema), TurfUserController.updateTurfUserHandler);
router.get("/all/:turfProfileId", TurfUserController.allTurfUserHandler);
router.delete("/delete/:turfUserId", TurfUserController.deleteTurfUserHandler);


export const TurfUserRoutes = router;
