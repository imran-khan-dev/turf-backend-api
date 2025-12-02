// src/app/modules/auth/refresh.controller.ts
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

/**
 * POST /api/auth/refresh
 * reads refreshToken cookie or body
 */
export const refreshTokens = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) throw new AppError(401, "Refresh token required");

  // AuthService.refreshAccessToken returns a fresh pair { accessToken, refreshToken }
  const tokens = await AuthService.refreshAccessToken(refreshToken);

  // extra safety: verify that, when the token was a turfUser token, returned tokens carry same turfProfileId
  // (AuthService already checks DB presence — but we can optionally verify payload equality if needed)

  // set cookies (use your setAuthCookie util)
  // import setAuthCookie from utils/setCookie
  const { setAuthCookie } = require("../../utils/setCookie"); // require to avoid circular import in snippet
  setAuthCookie(res, tokens);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed",
    data: tokens,
  });
});
