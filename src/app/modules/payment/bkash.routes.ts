import { Router } from "express";
import { BkashController } from "./bkash.controller";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();

router.post("/make-payment", checkAuth("TURF_USER", "OWNER", "MANAGER"), BkashController.makePayment);
router.get("/callback", BkashController.callback);


export const PaymentRoutes = router;
