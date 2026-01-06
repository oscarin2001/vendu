"use server";

import {
  countManagerAssignmentsForWarehouse,
  countBranchAssignmentsForWarehouse,
} from "../../repos";

/**
 * Validate warehouse can be deleted (no active assignments)
 * @param warehouseId - Warehouse ID
 * @throws Error if warehouse has assignments
 */
export async function validateWarehouseCanBeDeleted(warehouseId: number) {
  const managerAssignments = await countManagerAssignmentsForWarehouse(
    warehouseId
  );
  const branchAssignments = await countBranchAssignmentsForWarehouse(
    warehouseId
  );

  if (managerAssignments > 0 || branchAssignments > 0) {
    throw new Error(
      "Cannot delete warehouse with active assignments. Remove all manager and branch assignments first."
    );
  }
}
