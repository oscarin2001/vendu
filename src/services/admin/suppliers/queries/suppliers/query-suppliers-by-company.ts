import { getSuppliersByCompanyService } from "../../services/suppliers";

export async function querySuppliersByCompany(tenantId: string) {
  return await getSuppliersByCompanyService(tenantId);
}
