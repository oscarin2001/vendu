"use server";

import { getCompanyByTenant } from "@/services/admin/company/services";

export async function getCompanySettings(tenantId: string) {
  const company = await getCompanyByTenant(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
}
