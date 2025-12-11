// // src/types/express.d.ts
// import { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       auth?: JwtPayload & {
//         // optional typed claims (one of these will exist)
//         adminId?: string;
//         userId?: string;
//         turfUserId?: string;
//         role?: string;
//         turfProfileId?: string;
//         email?: string | null;
//       };
//       user?: {
//         userId: string;
//       }
//     }
//   }
// }

// export { };

import { JwtPayload } from "jsonwebtoken";
import { User, Admin, TurfUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & {
        adminId?: string;
        userId?: string;
        turfUserId?: string;
        role?: string;
        turfProfileId?: string;
        email?: string | null;
      };
      user?: {
        userId?: string;
        role?: string;
        dbUser?: User | Admin | TurfUser; // actual DB object
        adminId?: string;
      };
    }
  }
}

export { };

