import { assignManagerToSupplierService } from "@/services/admin/suppliers/services";

export async function mutateAssignManagerToSupplier(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  return await assignManagerToSupplierService(tenantId, supplierId, managerId);
}
