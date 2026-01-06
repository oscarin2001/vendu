import { z } from "zod";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../schemas/supplier-schemas";

/**
 * Type definitions inferred from schemas
 */
export type CreateSupplierData = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierData = z.infer<typeof updateSupplierSchema>;
