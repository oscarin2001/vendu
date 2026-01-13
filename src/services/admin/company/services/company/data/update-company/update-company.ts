"use server";

import {
  getCompanyBySlug,
  updateCompany as updateCompanyRepo,
} from "@/services/admin/company/repos";
import { validateCompanyUpdateData } from "@/services/admin/company/services/validation";
import type { UpdateCompanyData } from "@/services/admin/company/services/validation";

/**
 * Update company business logic
 * Handles company update operations with proper validation and data transformation
 * @param tenantId - Company tenant identifier
 * @param data - Company update data
 * @returns Updated company data
 */
export async function updateCompany(tenantId: string, data: UpdateCompanyData) {
  // Validate input data
  const validatedData = validateCompanyUpdateData(data);

  // Get existing company to ensure it exists
  const existingCompany = await getCompanyBySlug(tenantId);
  if (!existingCompany) {
    throw new Error("Company not found");
  }

  // Update company
  const company = (await updateCompanyRepo(
    existingCompany.PK_company,
    validatedData
  )) as any;

  return {
    id: company.PK_company,
    name: company.name,
    slug: company.slug,
    taxId: company.taxId,
    taxIdPath: company.taxIdPath,
    businessName: company.businessName,
    fiscalAddress: company.fiscalAddress,
    country: company.country,
    department: company.department,
    commerceType: company.commerceType,
    description: company.description,
    vision: company.vision,
    mission: company.mission,
  };
}
