import express from 'express';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfOwnerZodSchema } from './user.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post("/register-owner", multerUpload.single("file"),
    validateRequest(createTurfOwnerZodSchema),
    UserController.createTurfOwnerHandler);

router.get("/get-owners", checkAuth("ADMIN", "SUPER_ADMIN"), UserController.getAllOwnersHandler);

// router.post("/create-manager", checkAuth("OWNER"), UserController.createTurfManagerHandler);
router.get("/get-managers/:turfProfileId", checkAuth("OWNER"), UserController.getManagersByTurfProfileHandler);
router.get("/my-turf-profile", checkAuth("OWNER"), UserController.myTrufProfile);


export const UserRoutes = router;
