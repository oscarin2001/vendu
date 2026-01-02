import { z } from "zod";

export const createSupplierSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierData = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierData = z.infer<typeof updateSupplierSchema>;
