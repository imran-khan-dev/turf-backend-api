import { z } from "zod";

export const createTurfOwnerZodSchema = z.object({
    name: z.string().min(2).max(50),

    email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" })
        .min(5)
        .max(100),

    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, "Must contain uppercase letter")
        .regex(/^(?=.*\d)/, "Must contain number")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain special character"),

    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number"),

    photo: z
        .string()
        .regex(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, "Invalid image URL")
        .optional(),
});
