
import { envVars } from "../config/env";
import { Admin } from "@prisma/client";
import { signToken } from "./jwt";

export const createAdminTokens = (admin: Admin) => {
    const payload = {
        adminId: admin.id,
        role: admin.role, // SUPER_ADMIN | MANAGER_ADMIN
        email: admin.email,
    };

    const accessToken = signToken(payload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = signToken(payload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    return { accessToken, refreshToken };
};