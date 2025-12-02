// import bcryptjs from "bcryptjs";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import { prisma } from "../../db";

// passport.use(
//     new LocalStrategy(
//         {
//             usernameField: "email",
//             passwordField: "password",
//         },
//         async (email: string, password: string, done) => {
//             try {
//                 const isUserExist = await prisma.user.findUnique({
//                     where: {
//                         email: email
//                     }
//                 });

//                 if (!isUserExist) {
//                     return done("User does not exist");
//                 }


//                 const isPasswordMatched = await bcryptjs.compare(
//                     password as string,
//                     isUserExist.password as string
//                 );

//                 if (!isPasswordMatched) {
//                     return done(null, false, { message: "Password does not match" });
//                 }

//                 return done(null, isUserExist);
//             } catch (error) {
//                 console.log(error);
//                 done(error);
//             }
//         }
//     )
// );

// passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
//     done(null, user._id);
// });

// passport.deserializeUser(async (id: string, done: any) => {

//     if (!id) {
//         return done(null, false);
//     }

//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: id
//             }
//         });
//         done(null, user);
//     } catch (error) {
//         console.log(error);
//         done(error);
//     }
// });


// src/auth/passport.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "../../db";


// Admin strategy
passport.use(
    "admin-local",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const admin = await prisma.admin.findUnique({ where: { email } });
            if (!admin) return done(null, false, { message: "Admin not found" });

            const ok = await bcrypt.compare(password, admin.password);
            if (!ok) return done(null, false, { message: "Invalid password" });

            return done(null, admin);
        } catch (err) {
            return done(err as Error);
        }
    })
);

// Global user (owner/manager) strategy
passport.use(
    "user",
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });

                if (!user) return done(null, false, { message: "User not found" });

                const match = await bcrypt.compare(password, user.password);
                if (!match) return done(null, false, { message: "Wrong password" });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// TurfUser (tenant-specific) strategy — need turfId from req
passport.use(
    "turf-user",
    new LocalStrategy(
        { usernameField: "email", passwordField: "password", passReqToCallback: true },
        async (req, email, password, done) => {
            const { turfProfileId } = req.body;

            if (!turfProfileId) return done(null, false, { message: "Missing turfProfileId" });

            try {
                const user = await prisma.turfUser.findFirst({
                    where: { email, turfProfileId }
                });

                if (!user) return done(null, false, { message: "User not found" });

                if (!user.password) return done(null, false, { message: "Password not set" });

                const match = await bcrypt.compare(password, user.password);

                if (!match) return done(null, false, { message: "Wrong password" });

                return done(null, user);
            } catch (e) {
                return done(e);
            }
        }
    )
);

export default passport;
