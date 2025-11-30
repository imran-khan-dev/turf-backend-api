import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../../db";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email: string, password: string, done) => {
            try {
                const isUserExist = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });

                if (!isUserExist) {
                    return done("User does not exist");
                }


                const isPasswordMatched = await bcryptjs.compare(
                    password as string,
                    isUserExist.passwordHash as string
                );

                if (!isPasswordMatched) {
                    return done(null, false, { message: "Password does not match" });
                }

                return done(null, isUserExist);
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {

    const userIdNum = Number(id)

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userIdNum
            }
        });
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});
