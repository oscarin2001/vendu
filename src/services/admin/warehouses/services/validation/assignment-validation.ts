"use server";

import {
  findManagerWarehouseAssignment,
  findWarehouseBranchAssignment,
} from "../../repos";

/**
 * Validate manager is not already assigned to warehouse
 * @param managerId - Manager ID
 * @param warehouseId - Warehouse ID
 * @throws Error if already assigned
 */
export async function validateManagerNotAssigned(
  managerId: number,
  warehouseId: number
) {
  const existing = await findManagerWarehouseAssignment(managerId, warehouseId);
  if (existing) {
    throw new Error("Manager is already assigned to this warehouse");
  }
}

/**
 * Validate manager assignment exists
 * @param managerId - Manager ID
 * @param warehouseId - Warehouse ID
 * @throws Error if not assigned
 */
export async function validateManagerAssignmentExists(
  managerId: number,
  warehouseId: number
) {
  const assignment = await findManagerWarehouseAssignment(
    managerId,
    warehouseId
  );
  if (!assignment) {
    throw new Error("Manager is not assigned to this warehouse");
  }
  return assignment;
}

/**
 * Validate warehouse is not already assigned to branch
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @throws Error if already assigned
 */
export async function validateWarehouseNotAssignedToBranch(
  warehouseId: number,
  branchId: number
) {
  const existing = await findWarehouseBranchAssignment(warehouseId, branchId);
  if (existing) {
    throw new Error("Warehouse is already assigned to this branch");
  }
}

/**
 * Validate warehouse-branch assignment exists
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @throws Error if not assigned
 */
export async function validateWarehouseBranchAssignmentExists(
  warehouseId: number,
  branchId: number
) {
  const assignment = await findWarehouseBranchAssignment(warehouseId, branchId);
  if (!assignment) {
    throw new Error("Warehouse is not assigned to this branch");
  }
  return assignment;
}
