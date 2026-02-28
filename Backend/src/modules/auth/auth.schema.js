import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6, "Password too short"),
    role: z.enum(["TRAINER", "INSTITUTION", "STUDENT"]),
    phone: z.string().optional().or(z.literal("")),
    organization: z.string().optional().or(z.literal("")),
    agreeTerms: z.boolean().optional().or(z.literal("")),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6),
  }),
});
