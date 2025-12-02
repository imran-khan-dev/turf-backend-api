// src/modules/bookings/booking.routes.ts
import { Router } from "express";
import { getFieldSlots, createBooking, getMyBookings } from "./booking.controller";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();

router.get("/fields/:fieldId/slots", getFieldSlots);
router.post("/bookings", checkAuth("TURF_USER", "OWNER", "MANAGER"), createBooking);
router.get("/bookings/my", checkAuth("TURF_USER", "OWNER", "MANAGER"), getMyBookings);

export const BookingRoutes = router;
