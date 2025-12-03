import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  BCRYPT_SALT_ROUND: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_PHONE: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  COOKIE_SECURE: string;
  COOKIE_SAME_SITE: string;
  BKASH_BASE_URL: string;
  BKASH_CHECKOUT_URL_APP_KEY: string;
  BKASH_CHECKOUT_URL_APP_SECRET: string;
  BKASH_CHECKOUT_URL_USER_NAME: string;
  BKASH_CHECKOUT_URL_PASSWORD: string;
  APP_BASE_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "BCRYPT_SALT_ROUND",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ADMIN_PHONE",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "COOKIE_SECURE",
    "COOKIE_SAME_SITE",
    "BKASH_BASE_URL",
    "BKASH_CHECKOUT_URL_APP_KEY",
    "BKASH_CHECKOUT_URL_APP_SECRET",
    "BKASH_CHECKOUT_URL_USER_NAME",
    "BKASH_CHECKOUT_URL_PASSWORD",
    "APP_BASE_URL",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require envirnment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    ADMIN_PHONE: process.env.ADMIN_PHONE as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    COOKIE_SECURE: process.env.COOKIE_SECURE as string,
    COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE as string,
    BKASH_BASE_URL: process.env.BKASH_BASE_URL as string,
    BKASH_CHECKOUT_URL_APP_KEY: process.env.BKASH_CHECKOUT_URL_APP_KEY as string,
    BKASH_CHECKOUT_URL_APP_SECRET: process.env.BKASH_CHECKOUT_URL_APP_SECRET as string,
    BKASH_CHECKOUT_URL_USER_NAME: process.env.BKASH_CHECKOUT_URL_USER_NAME as string,
    BKASH_CHECKOUT_URL_PASSWORD: process.env.BKASH_CHECKOUT_URL_PASSWORD as string,
    APP_BASE_URL: process.env.APP_BASE_URL as string,
  };
};

export const envVars = loadEnvVariables();
