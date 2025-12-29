"use server";

import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  isWarehouse: z.boolean().default(false),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  department: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

export type CreateBranchData = z.infer<typeof createBranchSchema>;
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
