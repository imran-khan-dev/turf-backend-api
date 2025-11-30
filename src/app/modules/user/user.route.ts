import express from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post("/register-owner", multerUpload.single("file"), UserController.createTurfOwnerHandler);
router.post("/create-manager", UserController.createTurfManagerHandler);

export const UserRoutes = router;
