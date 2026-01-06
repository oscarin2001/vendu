"use server";

import {
  getCompanyBySlug,
  removeManagerFromSupplier,
} from "../../../repos/suppliers";

/**
 * Remove a manager from a supplier
 * @param tenantId - The company slug/tenant identifier
 * @param supplierId - The supplier ID
 * @param managerId - The manager ID to remove
 * @returns Success confirmation
 * @throws Error if assignment not found
 */
export async function removeManagerFromSupplierService(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  const company = await getCompanyBySlug(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }

  await removeManagerFromSupplier(supplierId, managerId);
  return { success: true };
}
