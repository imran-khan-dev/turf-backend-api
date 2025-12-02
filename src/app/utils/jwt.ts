import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";

export const signToken = (payload: JwtPayload | string | Buffer, secret: Secret, expiresIn: string | number) =>
    jwt.sign(payload, secret, { expiresIn } as SignOptions);

export const verifyToken = (token: string, secret: Secret) =>
    jwt.verify(token, secret) as JwtPayload;