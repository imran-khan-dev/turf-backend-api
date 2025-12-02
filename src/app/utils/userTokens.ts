import { signToken } from "./jwt";
import { envVars } from "../config/env";
import { User } from "@prisma/client";

export const createUserTokens = (user: User) => {
  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email
  };

  const accessToken = signToken(payload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
  const refreshToken = signToken(payload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  return { accessToken, refreshToken };
};
