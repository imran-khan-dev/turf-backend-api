import express from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfOwnerZodSchema } from './user.validation';

const router = express.Router();

router.post("/register-owner", multerUpload.single("file"), validateRequest(createTurfOwnerZodSchema), UserController.createTurfOwnerHandler);
router.post("/create-manager", UserController.createTurfManagerHandler);

export const UserRoutes = router;
