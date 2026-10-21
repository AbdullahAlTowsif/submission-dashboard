import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.email({ error: "A valid email is required" }),
    password: z
        .string({ error: "Password is required" })
        .min(1, { error: "Password is required" }),
});

export const registerZodSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(1, { error: "Name is required" }),
    email: z.email({ error: "A valid email is required" }),
    password: z
        .string({ error: "Password is required" })
        .min(6, { error: "Password must be at least 6 characters" })
        .max(72, { error: "Password must be at most 72 characters" }),
});
