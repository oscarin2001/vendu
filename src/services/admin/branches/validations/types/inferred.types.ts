import { z } from "zod";
import {
  createBranchSchema,
  updateBranchSchema,
  branchFiltersSchema,
} from "../schemas/branch-schema";

/**
 * Type definitions inferred from schemas
 */
export type CreateBranchData = z.infer<typeof createBranchSchema>;
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
export type BranchFilters = z.infer<typeof branchFiltersSchema>;
