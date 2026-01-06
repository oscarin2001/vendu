import { updateSupplierService } from "@/services/admin/suppliers/services";

export async function mutateUpdateSupplier(supplierId: number, data: any) {
  return await updateSupplierService(supplierId, data);
}
