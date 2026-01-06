import { z } from "zod";

/**
 * Schema for creating a new manager
 */
export const createManagerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ci: z.string().min(1, "CI is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  salary: z.number().min(0, "Salary must be positive").optional(),
  branchIds: z.array(z.number()).optional().default([]),
  contributionType: z.enum(["none", "contributes", "paid"]),
  hireDate: z.date().optional(),
});

/**
 * Schema for updating an existing manager
 */
export const updateManagerSchema = createManagerSchema
  .partial()
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .optional(),
  });

/**
 * Schema for manager filters
 */
export const managerFiltersSchema = z.object({
  search: z.string().optional(),
  branch: z.string().optional(),
  status: z.enum(["all", "active", "deactivated", "inactive"]).optional(),
});
