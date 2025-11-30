import express from 'express';
import { UserController } from './user.controller'; 

const router = express.Router();

router.post("/create-turf-owner", UserController.createTurfOwnerHandler);

export const UserRoutes = router;
export default UserRoutes;
