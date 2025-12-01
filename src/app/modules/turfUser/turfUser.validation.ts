
import { z } from "zod";

export const UserStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const createTurfUserZodSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must not exceed 100 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least one number" })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least one special character" }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Invalid Bangladesh phone number (Example: +8801XXXXXXXXX or 01XXXXXXXXX)",
    }),

  turfProfileId: z
    .string()
    .uuid({ message: "turfProfileId must be a valid UUID" }),

  photo: z
    .string()
    .regex(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, {
      message: "Photo must be a valid image URL ending with .jpg / .jpeg / .png / .webp",
    })
    .optional(),
});

