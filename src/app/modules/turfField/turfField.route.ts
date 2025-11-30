import express from 'express';
import { TurfFieldController } from './turfField.controller';

const router = express.Router();

router.post("/create", TurfFieldController.createTurfFieldHandler);


export const TurfFieldRoutes = router;
