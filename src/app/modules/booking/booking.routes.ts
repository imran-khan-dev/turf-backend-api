import { Router } from "express";
import { getFieldSlots, createBooking, getBookings, getBookingById } from "./booking.controller";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();

router.get("/fields/:fieldId/slots", getFieldSlots);
router.post("/make-booking", checkAuth("TURF_USER", "OWNER", "MANAGER"), createBooking);
router.get("/get-bookings", checkAuth("TURF_USER", "OWNER", "MANAGER"), getBookings);
router.get("/get-booking/:id", getBookingById);

export const BookingRoutes = router;