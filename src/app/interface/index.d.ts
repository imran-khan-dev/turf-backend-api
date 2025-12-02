// import { JwtPayload } from "jsonwebtoken";

// declare global {
//     namespace Express {
//         interface Request {
//             user?: JwtPayload & {
//                 id: string;
//                 role: "OWNER" | "MANAGER" | "USER";
//                 email?: string;
//             };
//         }
//     }
// }


// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & {
        // optional typed claims (one of these will exist)
        adminId?: string;
        userId?: string;
        turfUserId?: string;
        role?: string;
        turfProfileId?: string;
        email?: string | null;
      };
      user?: any
    }
  }
}

export { };
