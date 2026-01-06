import { getCompanyByTenant } from "@/services/admin/company/services";

export async function queryCompanyByTenant(tenantId: string) {
  return await getCompanyByTenant(tenantId);
}
