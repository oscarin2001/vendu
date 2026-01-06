"use server";

import {
  createWarehouseBranchAssignment,
  updateBranchPrimaryAssignments,
  deleteWarehouseBranchAssignment,
} from "../../repos/data/branch-assignment-repository";
import {
  validateCompanyExists,
  validateWarehouseExists,
  validateBranchExists,
} from "../../services/validation";
import {
  validateWarehouseNotAssignedToBranch,
  validateWarehouseBranchAssignmentExists,
} from "../../services/validation";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Assign a warehouse to a branch
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @param isPrimary - Whether this is the primary warehouse for the branch
 * @param context - User context for auditing
 * @returns Assignment details
 */
export async function assignWarehouseToBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  isPrimary: boolean = false,
  context?: UserContext
) {
  const company = await validateCompanyExists(tenantId);

  // Validate entities exist
  await validateWarehouseExists(warehouseId, company.PK_company);
  await validateBranchExists(branchId, company.PK_company);

  // Validate not already assigned
  await validateWarehouseNotAssignedToBranch(warehouseId, branchId);

  // If setting as primary, remove other primary assignments for this branch
  if (isPrimary) {
    await updateBranchPrimaryAssignments(branchId, false);
  }

  const assignment = await createWarehouseBranchAssignment(
    warehouseId,
    branchId,
    isPrimary,
    context?.employeeId
  );

  return {
    id: assignment.PK_warehouse_branch,
    warehouseId: assignment.FK_warehouse,
    branchId: assignment.FK_branch,
    isPrimary: assignment.isPrimary,
    assignedAt: assignment.assignedAt,
  };
}

/**
 * Remove a warehouse from a branch
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function removeWarehouseFromBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  context?: UserContext
) {
  const company = await validateCompanyExists(tenantId);

  // Validate entities exist
  await validateWarehouseExists(warehouseId, company.PK_company);
  await validateBranchExists(branchId, company.PK_company);

  // Validate assignment exists
  await validateWarehouseBranchAssignmentExists(warehouseId, branchId);

  await deleteWarehouseBranchAssignment(warehouseId, branchId);

  return { success: true };
}
