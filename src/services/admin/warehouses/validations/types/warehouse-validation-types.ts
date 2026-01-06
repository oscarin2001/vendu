import { z } from "zod";
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  assignManagerSchema,
  assignBranchSchema,
} from "../schemas/warehouse-schemas";

/**
 * Type inference helpers
 */
export type CreateWarehouseData = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseData = z.infer<typeof updateWarehouseSchema>;
export type AssignManagerData = z.infer<typeof assignManagerSchema>;
export type AssignBranchData = z.infer<typeof assignBranchSchema>;
