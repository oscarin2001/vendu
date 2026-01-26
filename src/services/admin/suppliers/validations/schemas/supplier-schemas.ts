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
  department: z
    .string()
    .min(2, "Departamento muy corto")
    .max(80, "Departamento muy largo")
    .optional(),
  country: z
    .string()
    .min(2, "País muy corto")
    .max(80, "País muy largo")
    .optional(),
  ci: z.string().max(20).optional(),
  notes: z.string().optional(),
  birthDate: z.preprocess((arg) => {
    if (typeof arg === "string") {
      const d = new Date(arg);
      return isNaN(d.getTime()) ? null : d;
    }
    return arg;
  }, z.date().optional().nullable()), // Fecha de nacimiento del proveedor
  partnerSince: z.preprocess((arg) => {
    if (typeof arg === "string") {
      const d = new Date(arg);
      return isNaN(d.getTime()) ? null : d;
    }
    return arg;
  }, z.date().optional().nullable()), // Desde cuándo trabaja con la empresa
  contractEndAt: z.preprocess((arg) => {
    if (typeof arg === "string") {
      if (arg.trim() === "") return null;
      const d = new Date(arg);
      return isNaN(d.getTime()) ? null : d;
    }
    return arg;
  }, z.date().optional().nullable()), // Fecha fin de contrato (nulo = indefinido)
  isIndefinite: z.boolean().optional(),
});

/**
 * Schema for updating an existing supplier
 */
export const updateSupplierSchema = createSupplierSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();
