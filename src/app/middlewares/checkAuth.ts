import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../../db";
import { envVars } from "../config/env";

export const checkAuth =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // Select cookie BASED ON allowed roles
      for (const role of allowedRoles) {
        const cookieName =
          role === "OWNER"
            ? "ownerAccess"
            : role === "MANAGER"
            ? "managerAccess"
            : role === "TURF_USER"
            ? "turfAccess"
            : role === "ADMIN"
            ? "adminAccess"
            : null;

        if (cookieName && req.cookies[cookieName]) {
          token = req.cookies[cookieName];
          break;
        }
      }

      // Otherwise use Authorization header
      if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts[0] === "Bearer") token = parts[1];
      }

      if (!token) {
        throw new AppError(401, "Unauthorized: No token found");
      }

      // Decode token
      const decoded = verifyToken(
        token,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // Role check
      if (!allowedRoles.includes(decoded.role)) {
        throw new AppError(403, "Forbidden: Access Denied");
      }

      // Load correct user
      let user = null;

      if (decoded.role === "OWNER" || decoded.role === "MANAGER") {
        user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      } else if (decoded.role === "TURF_USER") {
        user = await prisma.turfUser.findUnique({
          where: { id: decoded.turfUserId },
        });
      } else if (decoded.role === "ADMIN") {
        user = await prisma.admin.findUnique({
          where: { id: decoded.adminId },
        });
      }

      if (!user) throw new AppError(404, "User not found");

      // Pass full decoded payload + database user
      req.user = {
        ...decoded, // includes userId, turfUserId, turfProfileId, email, etc.
        dbUser: user,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
