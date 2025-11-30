import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.post("/register", AdminController.createAdminHandler);

export const AdminRoutes = router;
