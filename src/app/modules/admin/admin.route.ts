import express from 'express';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createAdminZodSchema } from './admin.validation';
import checkAuth from '../../middlewares/checkAuth';

const router = express.Router();

router.post("/register", checkAuth("SUPER_ADMIN"), validateRequest(createAdminZodSchema), AdminController.createAdminHandler);

export const AdminRoutes = router;
