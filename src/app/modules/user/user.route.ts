import express from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfOwnerSchema } from './user.validation';

const router = express.Router();

router.post("/register-owner", multerUpload.single("file"), validateRequest(createTurfOwnerSchema), UserController.createTurfOwnerHandler);
router.post("/create-manager", UserController.createTurfManagerHandler);

export const UserRoutes = router;
