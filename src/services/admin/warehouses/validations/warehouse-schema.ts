import { z } from "zod";

/**
 * Schema for creating a new warehouse
 */
export const createWarehouseSchema = z.object({
  name: z
    .string()
    .min(1, "Warehouse name is required")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string().optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must be less than 255 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  department: z.string().optional(),
  country: z.string().optional(),
  openedAt: z.date().optional().nullable(), // Fecha de apertura de la bodega
});

/**
 * Schema for updating an existing warehouse
 * All fields are optional for partial updates
 */
export const updateWarehouseSchema = createWarehouseSchema.partial();

/**
 * Schema for warehouse query parameters
 */
export const warehouseQuerySchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  warehouseId: z.number().positive("Warehouse ID must be positive").optional(),
});

/**
 * Schema for assigning a manager to warehouse
 */
export const assignManagerSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  warehouseId: z.number().positive("Warehouse ID must be positive"),
  managerId: z.number().positive("Manager ID must be positive"),
});

/**
 * Schema for assigning warehouse to branch
 */
export const assignBranchSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  warehouseId: z.number().positive("Warehouse ID must be positive"),
  branchId: z.number().positive("Branch ID must be positive"),
  isPrimary: z.boolean().default(false),
});

/**
 * Type inference helpers
 */
export type CreateWarehouseData = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseData = z.infer<typeof updateWarehouseSchema>;
export type AssignManagerData = z.infer<typeof assignManagerSchema>;
export type AssignBranchData = z.infer<typeof assignBranchSchema>;
