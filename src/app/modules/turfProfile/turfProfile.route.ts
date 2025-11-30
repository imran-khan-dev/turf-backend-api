import express from 'express';
import { TurfProfileController } from './turfProfile.controller';

const router = express.Router();

router.post("/create/:id", TurfProfileController.createTurfProfileHandler);


export const TurfProfileRoutes = router;
