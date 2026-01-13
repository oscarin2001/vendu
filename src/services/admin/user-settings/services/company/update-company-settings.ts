"use server";

import { updateCompany } from "@/services/admin/company/services";
import { UpdateCompanyData } from "@/services/admin/company/services/validation";

export async function updateCompanySettings(
  tenantId: string,
  data: UpdateCompanyData
) {
  return await updateCompany(tenantId, data);
}
