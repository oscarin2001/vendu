import { z } from "zod";

/**
 * Schema for creating a new supplier
 */
export const createSupplierSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  ci: z.string().max(20).optional(),
  notes: z.string().optional(),
  birthDate: z.date().optional().nullable(), // Fecha de nacimiento del proveedor
  partnerSince: z.date().optional().nullable(), // Desde cuándo trabaja con la empresa
});

/**
 * Schema for updating an existing supplier
 */
export const updateSupplierSchema = createSupplierSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();
