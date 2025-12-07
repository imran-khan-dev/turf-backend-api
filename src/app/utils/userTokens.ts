// import { signToken } from "./jwt";
// import { envVars } from "../config/env";
// import { User } from "@prisma/client";

// export const createUserTokens = (user: User) => {
//   const payload = {
//     userId: user.id,
//     role: user.role,
//     email: user.email
//   };

//   const accessToken = signToken(payload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
//   const refreshToken = signToken(payload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

//   return { accessToken, refreshToken };
// };



import { signToken } from "./jwt";
import { envVars } from "../config/env";
import { User, TurfUser } from "@prisma/client";

export const createUserTokens = (user: User | TurfUser) => {
  // Base payload for all users
  const payload: Record<string, any> = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  if ("phone" in user && user.phone) payload.phone = user.phone;
  if ("photo" in user && user.photo) payload.photo = user.photo;

  // Include turfProfileId only for turf-specific users or managers
  if ("turfProfileId" in user && user.turfProfileId) {
    payload.turfProfileId = user.turfProfileId;
  }

  const accessToken = signToken(
    payload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = signToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken };
};
