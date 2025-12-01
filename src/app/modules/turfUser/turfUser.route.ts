import express from 'express';
import { TurfUserController } from './turfUser.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfUserZodSchema } from './turfUser.validation';

const router = express.Router();

router.post("/register", multerUpload.single("file"), validateRequest(createTurfUserZodSchema), TurfUserController.createTurfUserHandler);
// router.post("/update", TurfUserController.updateTurfUserHandler);
// router.post("/all", TurfUserController.allTurfUserHandler);
// router.post("/delete", TurfUserController.deleteTurfUserHandler);


export const TurfUserRoutes = router;
