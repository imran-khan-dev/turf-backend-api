import { Response } from "express";
import { envVars } from "../config/env";

export const setAuthCookie = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  role: "owner" | "manager" | "turfUser" | "admin"
) => {
  res.cookie(`${role}Access`, tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: envVars.COOKIE_SAME_SITE as "none" | "lax" | "strict",
  });

  res.cookie(`${role}Refresh`, tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: envVars.COOKIE_SAME_SITE as "none" | "lax" | "strict",
  });
};
