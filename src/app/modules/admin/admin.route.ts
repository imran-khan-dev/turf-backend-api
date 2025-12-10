import express from 'express';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createAdminZodSchema } from './admin.validation';
import checkAuth from '../../middlewares/checkAuth';

const router = express.Router();

router.post("/create-admin", checkAuth("SUPER_ADMIN"), validateRequest(createAdminZodSchema), AdminController.createAdminHandler);

router.delete("/delete-admin/:email", checkAuth("SUPER_ADMIN"), AdminController.deleteAdminHandler);

export const AdminRoutes = router;
