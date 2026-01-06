import { updateCompany } from "@/services/admin/company/services";

export async function mutateUpdateCompany(tenantId: string, data: any) {
  return await updateCompany(tenantId, data);
}
