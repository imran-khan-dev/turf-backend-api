import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

// router.post("/login", AuthControllers.credentialsLogin);

router.post("/admin/login", AuthControllers.adminLogin);
router.post("/owner/login", AuthControllers.ownerLogin);
router.post("/manager/login", AuthControllers.managerLogin);
router.post("/turf-user/login/:turfId", AuthControllers.turfUserLogin);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
