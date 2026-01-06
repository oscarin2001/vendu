"use server";

import { prisma } from "@/lib/prisma";

/**
 * Find branch by ID and company
 * @param branchId - Branch ID
 * @param companyId - Company ID
 * @returns Branch record or null
 */
export async function findBranchByIdAndCompany(
  branchId: number,
  companyId: number
) {
  return await prisma.tbbranches.findFirst({
    where: {
      PK_branch: branchId,
      FK_company: companyId,
    },
  });
}

/**
 * Find warehouse-branch assignment
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @returns Assignment record or null
 */
export async function findWarehouseBranchAssignment(
  warehouseId: number,
  branchId: number
) {
  return await prisma.tbwarehouse_branches.findUnique({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: warehouseId,
        FK_branch: branchId,
      },
    },
  });
}

/**
 * Count branch assignments for warehouse
 * @param warehouseId - Warehouse ID
 * @returns Number of assignments
 */
export async function countBranchAssignmentsForWarehouse(warehouseId: number) {
  return await prisma.tbwarehouse_branches.count({
    where: { FK_warehouse: warehouseId },
  });
}

/**
 * Create warehouse-branch assignment
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @param isPrimary - Whether this is primary warehouse for branch
 * @param assignedBy - Employee ID who assigned
 * @returns Created assignment
 */
export async function createWarehouseBranchAssignment(
  warehouseId: number,
  branchId: number,
  isPrimary: boolean,
  assignedBy?: number
) {
  return await prisma.tbwarehouse_branches.create({
    data: {
      FK_warehouse: warehouseId,
      FK_branch: branchId,
      isPrimary,
      FK_assignedBy: assignedBy,
    },
  });
}

/**
 * Update warehouse-branch assignments for branch (set primary)
 * @param branchId - Branch ID
 * @param isPrimary - Primary status to set
 */
export async function updateBranchPrimaryAssignments(
  branchId: number,
  isPrimary: boolean
) {
  await prisma.tbwarehouse_branches.updateMany({
    where: { FK_branch: branchId },
    data: { isPrimary },
  });
}

/**
 * Delete warehouse-branch assignment
 * @param warehouseId - Warehouse ID
 * @param branchId - Branch ID
 * @returns Deleted assignment
 */
export async function deleteWarehouseBranchAssignment(
  warehouseId: number,
  branchId: number
) {
  return await prisma.tbwarehouse_branches.delete({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: warehouseId,
        FK_branch: branchId,
      },
    },
  });
}
