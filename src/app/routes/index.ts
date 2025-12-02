import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { TurfUserRoutes } from "../modules/turfUser/turfUser.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { TurfProfileRoutes } from "../modules/turfProfile/turfProfile.route";
import { TurfFieldRoutes } from "../modules/turfField/turfField.route";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";


export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/turf-profile",
    route: TurfProfileRoutes,
  },
  {
    path: "/turf-user",
    route: TurfUserRoutes,
  },
  {
    path: "/turf-field",
    route: TurfFieldRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
