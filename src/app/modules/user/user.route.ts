import express from 'express';
import { UserController } from './user.controller'; 

const router = express.Router();

router.post("/create-turf-owner", UserController.createTurfOwnerHandler);
router.post("/create-turf-manager", UserController.createTurfManagerHandler);

export const UserRoutes = router;
export default UserRoutes;
