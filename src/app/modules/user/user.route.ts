import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post("/register-owner", UserController.createTurfOwnerHandler);
router.post("/register-manager", UserController.createTurfManagerHandler);

export const UserRoutes = router;
