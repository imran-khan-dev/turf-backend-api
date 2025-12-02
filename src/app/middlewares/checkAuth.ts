import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../../db";
import { envVars } from "../config/env";

// export const checkAuth =
//   (...allowedRoles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const accessToken =
//           req.headers.authorization || req.cookies.accessToken;

//         if (!accessToken) {
//           throw new AppError(403, "No Token Provided");
//         }

//         // Verify Token
//         const decoded = verifyToken(
//           accessToken,
//           envVars.JWT_ACCESS_SECRET
//         ) as JwtPayload;

//         if (!decoded.role) {
//           throw new AppError(403, "Invalid Token Payload");
//         }

//         // Check role permission
//         if (!allowedRoles.includes(decoded.role)) {
//           throw new AppError(403, "You are not allowed to access this route");
//         }

//         // Validate user by role
//         let user;

//         if (decoded.role === "OWNER" || decoded.role === "MANAGER") {
//           user = await prisma.user.findUnique({
//             where: { id: decoded.userId },
//           });
//         }

//         if (decoded.role === "TURF_USER") {
//           user = await prisma.turfUser.findUnique({
//             where: { id: decoded.turfUserId },
//           });
//         }

//         if (decoded.role === "ADMIN") {
//           user = await prisma.admin.findUnique({
//             where: { id: decoded.adminId },
//           });
//         }

//         if (!user) {
//           throw new AppError(httpStatus.BAD_REQUEST, "User not found");
//         }

//         // Attach decoded token to req
//         req.user = decoded;

//         next();
//       } catch (error) {
//         console.log("Auth Error:", error);
//         next(error);
//       }
//     };


// export const checkAuth =
//   (...allowedRoles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         let accessToken =
//           req.headers.authorization || req.cookies.accessToken;

//         if (!accessToken) {
//           throw new AppError(403, "No Token Provided");
//         }

//         // Strip "Bearer "
//         if (typeof accessToken === "string" && accessToken.startsWith("Bearer ")) {
//           accessToken = accessToken.split(" ")[1];
//         }

//         // Verify token
//         const decoded = verifyToken(
//           accessToken,
//           envVars.JWT_ACCESS_SECRET
//         ) as JwtPayload;

//         if (!decoded.role) {
//           throw new AppError(403, "Invalid Token Payload");
//         }

//         if (!allowedRoles.includes(decoded.role)) {
//           throw new AppError(403, "You are not allowed to access this route");
//         }

//         let user;

//         if (decoded.role === "OWNER" || decoded.role === "MANAGER") {
//           user = await prisma.user.findUnique({
//             where: { id: decoded.userId },
//           });
//         }

//         if (decoded.role === "TURF_USER") {
//           user = await prisma.turfUser.findUnique({
//             where: { id: decoded.turfUserId },
//           });
//         }

//         if (decoded.role === "ADMIN") {
//           user = await prisma.admin.findUnique({
//             where: { id: decoded.adminId },
//           });
//         }

//         if (!user) {
//           throw new AppError(400, "User not found");
//         }

//         // Attach normalized user
//         req.user = {
//           id:
//             decoded.userId ||
//             decoded.turfUserId ||
//             decoded.adminId,
//           role: decoded.role,
//         };

//         next();
//       } catch (error) {
//         console.log("Auth Error:", error);
//         next(error);
//       }
//     };


// export const checkAuth = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const cookieName = role + "Access";
//     const token = req.cookies[cookieName];

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: `Not authenticated as ${role}` });
//     }

//     try {
//       const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET);
//       req.user = decoded;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };

export const checkAuth =
  (...allowedRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let token: string | undefined;

        // Try cookie first
        for (const role of allowedRoles) {
          const cookieName =
            role === "OWNER" ? "ownerAccess" :
              role === "MANAGER" ? "managerAccess" :
                role === "TURF_USER" ? "turfAccess" :
                  role === "ADMIN" ? "adminAccess" : null;

          if (cookieName && req.cookies[cookieName]) {
            token = req.cookies[cookieName];
            break;
          }
        }

        // If no cookie, try Authorization header
        if (!token && req.headers.authorization) {
          const parts = req.headers.authorization.split(" ");
          if (parts[0] === "Bearer") token = parts[1];
        }

        if (!token) {
          throw new AppError(401, "Unauthorized: No token found");
        }

        const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

        if (!allowedRoles.includes(decoded.role)) {
          throw new AppError(403, "Forbidden: Access Denied");
        }

        let user;

        if (decoded.role === "OWNER" || decoded.role === "MANAGER") {
          user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        } else if (decoded.role === "TURF_USER") {
          user = await prisma.turfUser.findUnique({ where: { id: decoded.turfUserId } });
        } else if (decoded.role === "ADMIN") {
          user = await prisma.admin.findUnique({ where: { id: decoded.adminId } });
        }

        if (!user) throw new AppError(404, "User not found");

        req.user = {
          id: decoded.userId || decoded.turfUserId || decoded.adminId,
          role: decoded.role,
        };

        next();
      } catch (error) {
        next(error);
      }
    };


export default checkAuth;