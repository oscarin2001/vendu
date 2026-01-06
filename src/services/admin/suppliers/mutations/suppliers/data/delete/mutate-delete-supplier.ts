import { deleteSupplierService } from "@/services/admin/suppliers/services";

export async function mutateDeleteSupplier(supplierId: number) {
  return await deleteSupplierService(supplierId);
}
