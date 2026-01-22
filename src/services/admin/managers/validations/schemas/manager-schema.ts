import { z } from "zod";

/**
 * Schema for creating a new manager
 */
export const createManagerSchema = z.object({
  // Limit names to 20 characters to match UI limits
  // (min rules left as-is; UI/FIELD_LIMITS enforce min=2)
  firstName: z.string().min(1, "First name is required").max(20, "First name must be at most 20 characters"),
  lastName: z.string().min(1, "Last name is required").max(20, "Last name must be at most 20 characters"),
  ci: z.string().min(1, "CI is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  salary: z.number().min(0, "Salary must be positive").optional(),
  branchIds: z.array(z.number()).optional().default([]),
  contributionType: z.enum(["none", "contributes", "paid"]),
  hireDate: z.date().optional(),
  birthDate: z.date().optional(),
  joinedAt: z.date().optional(),
  contractEndAt: z.date().optional(),
  isIndefinite: z.boolean().optional(),
  homeAddress: z.string().max(300).optional(),
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
      .max(72, "Password must be at most 72 characters")
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
