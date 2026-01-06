import { z } from "zod";
import {
  createManagerSchema,
  updateManagerSchema,
  managerFiltersSchema,
} from "../schemas/manager-schema";

/**
 * Type definitions inferred from schemas
 */
export type CreateManagerData = z.infer<typeof createManagerSchema>;
export type UpdateManagerData = z.infer<typeof updateManagerSchema>;
export type ManagerFilters = z.infer<typeof managerFiltersSchema>;
