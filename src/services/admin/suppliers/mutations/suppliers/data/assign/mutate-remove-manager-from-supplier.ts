import { removeManagerFromSupplierService } from "@/services/admin/suppliers/services";

export async function mutateRemoveManagerFromSupplier(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  return await removeManagerFromSupplierService(
    tenantId,
    supplierId,
    managerId
  );
}
