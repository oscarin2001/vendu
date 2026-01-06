import { getCompanySubscription } from "@/services/admin/company/services";

export async function queryCompanySubscription(tenantId: string) {
  return await getCompanySubscription(tenantId);
}
