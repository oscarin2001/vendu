import { getSupplierByIdService } from "../../services/suppliers";

export async function querySupplierById(supplierId: number) {
  return await getSupplierByIdService(supplierId);
}
