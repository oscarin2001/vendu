import { z } from "zod";

/**
 * Schema for updating company data
 */
export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  taxId: z.string().optional(),
  country: z.string().optional(),
  department: z.string().optional(),
  commerceType: z.string().optional(),
  description: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
});

/**
 * Type for validated company update data
 */
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

/**
 * Validate company update data
 * @param data - Raw input data
 * @returns Validated data
 * @throws Validation error if data is invalid
 */
export function validateCompanyUpdateData(data: unknown): UpdateCompanyData {
  return updateCompanySchema.parse(data);
}
