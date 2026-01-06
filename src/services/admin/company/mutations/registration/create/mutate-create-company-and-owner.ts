import { createCompanyAndOwner } from "@/services/admin/company/repos";

export async function mutateCreateCompanyAndOwner(params: any) {
  return await createCompanyAndOwner(params);
}
