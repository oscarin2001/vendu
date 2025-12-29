"use server";

import { z } from "zod";

export const createManagerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ci: z.string().min(1, "CI is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  salary: z.number().min(0, "Salary must be positive"),
  branchId: z.number().optional(),
});

export const updateManagerSchema = createManagerSchema
  .partial()
  .omit({ password: true });

export type CreateManagerData = z.infer<typeof createManagerSchema>;
export type UpdateManagerData = z.infer<typeof updateManagerSchema>;
