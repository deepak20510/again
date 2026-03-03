import { z } from "zod";

export const getUsersSchema = z.object({
  role: z.enum(["STUDENT", "TRAINER", "INSTITUTION", "ADMIN"]).optional(),
  isVerified: z.string().optional().transform(val => val === "true"),
  isBanned: z.string().optional().transform(val => val === "true"),
  search: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const verifyUserSchema = z.object({
  verified: z.boolean().default(true),
});

export const banUserSchema = z.object({
  banned: z.boolean().default(true),
  reason: z.string().max(500, "Reason must not exceed 500 characters").optional(),
});

export const reportActionSchema = z.object({
  action: z.enum(["RESOLVE", "REJECT", "BAN_USER"], {
    errorMap: () => ({ message: "Action must be RESOLVE, REJECT, or BAN_USER" }),
  }),
  resolutionNote: z.string().max(1000, "Resolution note must not exceed 1000 characters").optional(),
});

export const getReportsSchema = z.object({
  status: z.enum(["PENDING", "RESOLVED", "DISMISSED"]).optional(),
  targetType: z.enum(["TRAINER", "MATERIAL", "REVIEW"]).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
});

export const reportIdParamSchema = z.object({
  id: z.string().uuid("Invalid report ID"),
});
