"use server";

import { deleteSupplier } from "../../../repos/suppliers";

/**
 * Delete a supplier (soft delete)
 * @param supplierId - The supplier ID to delete
 * @returns Success confirmation
 * @throws Error if supplier not found
 */
export async function deleteSupplierService(supplierId: number) {
  await deleteSupplier(supplierId);
  return { success: true };
}
