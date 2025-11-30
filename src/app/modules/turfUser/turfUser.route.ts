import express from 'express';
import { TurfUserController } from './turfUser.controller';

const router = express.Router();

router.post("/register", TurfUserController.createTurfUserHandler);


export const TurfUserRoutes = router;
