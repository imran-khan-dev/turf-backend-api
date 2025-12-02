import { Router } from "express";
import { AuthControllers } from "./auth.controller";
const router = Router();

// GLOBAL USERS
router.post("/login/owner", AuthControllers.ownerLogin);
router.post("/login/manager", AuthControllers.managerLogin);

// TURF-SPECIFIC USERS (CUSTOMERS)
router.post("/login/turf-user", AuthControllers.turfUserLogin); // expects turfProfileId

// ADMINS
router.post("/login/admin", AuthControllers.adminLogin);

// LOGOUT
router.post("/logout", AuthControllers.logout);

// SESSION CHECK
router.get("/sessions", (req, res) => {
    res.json({
        admin: !!req.cookies.adminAccess,
        owner: !!req.cookies.ownerAccess,
        manager: !!req.cookies.managerAccess,
        turfUser: !!req.cookies.turfAccess,
        canSwitchDashboard: !!req.cookies.managerAccess && !!req.cookies.turfAccess
    });
});

export const AuthRoutes = router;
