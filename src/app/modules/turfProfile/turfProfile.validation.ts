import { z } from "zod";

export const createTurfProfileZodSchema = z.object({
  // Required Fields
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long." })
    .max(50, { message: "Slug cannot exceed 50 characters." }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name cannot exceed 100 characters." }),

  // Optional Fields (nullable in Prisma)
  logo: z.string().url().optional(),

  // Top Bar
  email: z.string().email().optional(),
  phone: z
    .string()
    .optional(),
  openHours: z.string().optional(),
  facebookLink: z.string().url().optional(),
  instagramLink: z.string().url().optional(),
  whatsappLink: z.string().url().optional(),

  // Hero Section
  heroImage: z.string().url().optional(),
  heroTitle: z.string().optional(),

  // About Section
  aboutTitle: z.string().optional(),
  aboutDesc: z.string().optional(),
  aboutImg: z.string().url().optional(),

  // Turf List, Features, Gallery → Will be created separately
  // That's why we ignore them here in this schema
  // navMenu, turfItems, features, gallery  --> Not validated here

  // Contact Section
  address: z.string().optional(),
  googleMapLink: z.string().url().optional(),

  // Footer Section
  footerText: z.string().optional(),
});


export const updateTurfProfileZodSchema = z.object({
  // Basic Info
  slug: z.string().optional(),
  name: z.string().optional(),

  // Top Bar
  logo: z.string().optional(), // File handled via multer
  email: z.union([z.string().email(), z.literal("")]).optional(),
  phone: z.union([
    z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Invalid Bangladesh phone number. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    z.literal(""),
  ]).optional(),
  openHours: z.string().optional(),
  facebookLink: z.union([z.string().url(), z.literal("")]).optional(),
  instagramLink: z.union([z.string().url(), z.literal("")]).optional(),
  whatsappLink: z.union([z.string().url(), z.literal("")]).optional(),

  // Hero Section
  heroImage: z.string().optional(), // File handled via multer
  heroTitle: z.string().optional(),

  // About Section
  aboutTitle: z.string().optional(),
  aboutDesc: z.string().optional(),
  aboutImg: z.string().optional(), // File handled via multer

  // Contact Section
  address: z.string().optional(),
  googleMapLink: z.union([z.string().url(), z.literal("")]).optional(),

  // Footer Section
  footerText: z.string().optional(),
});
