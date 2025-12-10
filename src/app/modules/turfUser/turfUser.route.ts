import express from 'express';
import { TurfUserController } from './turfUser.controller';
import { multerUpload } from '../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTurfUserZodSchema, updateTurfUserZodSchema } from './turfUser.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post("/register", multerUpload.single("file"),
    validateRequest(createTurfUserZodSchema),
    TurfUserController.createTurfUserHandler);

router.patch("/update/:id", checkAuth("TURF_USER"),
    multerUpload.single("file"),
    validateRequest(updateTurfUserZodSchema),
    TurfUserController.updateTurfUserHandler);

router.get("/all", checkAuth("OWNER"), TurfUserController.allTurfUserHandler);
router.get("/all-turf-users-admin", checkAuth("ADMIN", "SUPER_ADMIN"), TurfUserController.getAllTurfUsersByAdmin);

router.delete("/delete/:turfUserId", checkAuth("ADMIN", "TURF_USER"), TurfUserController.deleteTurfUserHandler);


export const TurfUserRoutes = router;
