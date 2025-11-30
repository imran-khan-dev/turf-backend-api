import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { User } from '@prisma/client';
import { prisma } from "../../db";

export const createUserTokens = (user: User) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES
    );

    return {
        accessToken,
        refreshToken,
    };
};


export const createNewAccessTokenWithRefreshToken = async (
    refreshToken: string
) => {

    
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: verifiedRefreshToken.email
        }
    });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }


    const jwtPayload = {
        userId: isUserExist.id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    return accessToken;
};
