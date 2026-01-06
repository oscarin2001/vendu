"use server";

import {
  getCompanyBySlug,
  getSupplierByIdWithValidation,
  getManagerByIdWithValidation,
  checkSupplierManagerAssignmentExists,
  assignManagerToSupplier,
} from "../../../repos/suppliers";

/**
 * Assign a manager to a supplier
 * @param tenantId - The company slug/tenant identifier
 * @param supplierId - The supplier ID
 * @param managerId - The manager ID to assign
 * @returns Assignment information
 * @throws Error if validation fails or assignment already exists
 */
export async function assignManagerToSupplierService(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  const company = await getCompanyBySlug(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Verify that the supplier exists and belongs to the company
  const supplier = await getSupplierByIdWithValidation(supplierId);
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  // Verify that the manager exists, belongs to the company and has the right role
  const manager = await getManagerByIdWithValidation(managerId, tenantId);
  if (!manager) {
    throw new Error("Manager not found or does not have the required role");
  }

  // Check that the assignment doesn't already exist
  const existing = await checkSupplierManagerAssignmentExists(
    supplierId,
    managerId
  );
  if (existing) {
    throw new Error("Manager is already assigned to this supplier");
  }

  const assignment = await assignManagerToSupplier(supplierId, managerId);

  return {
    id: assignment.PK_supplier_manager,
    supplierId: assignment.FK_supplier,
    managerId: assignment.FK_manager,
    assignedAt: assignment.assignedAt,
  };
}
