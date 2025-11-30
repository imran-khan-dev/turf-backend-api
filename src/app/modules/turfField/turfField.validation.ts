import { z } from "zod";

export const createTurfFieldZodSchema = z.object({

    name: z
        .string()
        .min(2, { message: "Turf field name must be at least 2 characters." })
        .max(50, { message: "Turf field name cannot exceed 50 characters." }),

    pricePerSlot: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Price per slot must be a positive number.",
        })
        .transform((val) => Number(val)), // convert string to number

    slotDuration: z
        .string()
        .optional()
        .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
            message: "Slot duration must be a positive number.",
        })
        .transform((val) => (val ? Number(val) : 90)), // default 90 minutes

    available: z
        .string()
        .optional()
        .transform((val) => {
            if (val === undefined) return true;          // default
            if (val.toLowerCase() === "true") return true;
            if (val.toLowerCase() === "false") return false;
            return true; // fallback default
        }),

    photos: z
        .array(z.string().url())
        .optional(),
    turfProfileId: z
        .string().optional(),
});
