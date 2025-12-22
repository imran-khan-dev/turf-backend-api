import httpStatus from "http-status-codes";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { createAdminTokens } from "../../utils/adminTokens";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";


const ownerLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("user", async (err: any, user: any, info: any) => {
    if (err) return next(err);

    if (!user || user.role !== "OWNER") {
      return next(new AppError(401, "Invalid Owner Credentials"));
    }

    const tokens = createUserTokens(user);
    const { password, ...rest } = user;

    setAuthCookie(res, tokens, "owner");

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Owner Logged In Successfully",
      data: { ...tokens, user: rest },
    });
  })(req, res, next);
};


const managerLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("user", async (err: any, user: any, info: any) => {
    if (err) return next(err);

    if (!user || user.role !== "MANAGER") {
      return next(new AppError(401, "Invalid Manager Credentials"));
    }

    const tokens = createUserTokens(user);
    const { password, ...rest } = user;

    setAuthCookie(res, tokens, "manager");

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Manager Logged In Successfully",
      data: { ...tokens, user: rest },
    });
  })(req, res, next);
};


const turfUserLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("turf-user", async (err: any, user: any, info: any) => {
    if (err) return next(err);

    if (!user) {
      return next(new AppError(401, info?.message ?? "Invalid Credentials"));
    }


    const tokens = createUserTokens(user);

    const { password, ...rest } = user;

    setAuthCookie(res, tokens, "turfUser");

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Turf User Logged In Successfully",
      data: { ...tokens, user: rest },
    });
  })(req, res, next);
};


const adminLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("admin-local", async (err: any, admin: any, info: any) => {
    if (err) return next(err);

    if (!admin) {
      return next(new AppError(401, info?.message || "Invalid Admin Credentials"));
    }

    const tokens = createAdminTokens(admin);
    const { password, ...rest } = admin;

    setAuthCookie(res, tokens, "admin");

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Admin Logged In Successfully",
      data: { ...tokens, admin: rest },
    });
  })(req, res, next);
};

const logout = (req: Request, res: Response) => {
  const role = req.body.role; // owner | manager | turf | admin

  if (!role) {
    return res.status(400).json({ success: false, message: "role is required" });
  }

  res.clearCookie(`${role}Access`, { httpOnly: true, secure: true, sameSite: "none", path: "/", });
  res.clearCookie(`${role}Refresh`, { httpOnly: true, secure: true, sameSite: "none", path: "/", });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `${role} logged out`,
    data: null,
  });
};

const turfUserSessionCheck = (req: Request, res: Response) => {
  const token = req.cookies.turfUserAccess;
  const { turfProfileId } = req.query;

  if (!token) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Turf user not authenticated",
      data: {
        isAuthenticated: false,
      },
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as {
      userId: string;
      name: string;
      email: string;
      turfProfileId: string;
    };

    if (
      turfProfileId &&
      decoded.turfProfileId !== String(turfProfileId)
    ) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Turf user logged in to another turf",
        data: {
          isAuthenticated: false,
        },
      });
    }

    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Turf user authenticated",
      data: {
        isAuthenticated: true,
        user: {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          turfProfileId: decoded.turfProfileId,
        },
      },
    });
  } catch (error) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Invalid turf user session",
      data: {
        isAuthenticated: false,
      },
    });
  }
};

export const AuthControllers = {
  ownerLogin,
  managerLogin,
  turfUserLogin,
  adminLogin,
  logout,
  turfUserSessionCheck,
};
