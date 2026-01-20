import { z } from "zod";

/**
 * Schema for creating a new branch
 */
export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  department: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openedAt: z.date().optional().nullable(), // Fecha de apertura de la sucursal
});

/**
 * Schema for updating an existing branch
 */
export const updateBranchSchema = createBranchSchema.partial();

/**
 * Schema for branch filters
 */
export const branchFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "withManager", "withoutManager"]).optional(),
});
