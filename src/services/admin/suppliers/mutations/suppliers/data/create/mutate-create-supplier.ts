import { createSupplierService } from "@/services/admin/suppliers/services";

export async function mutateCreateSupplier(tenantId: string, data: any) {
  return await createSupplierService(tenantId, data);
}
