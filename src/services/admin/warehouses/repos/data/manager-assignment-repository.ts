"use server";

import { prisma } from "@/lib/prisma";

/**
 * Find manager by ID and company
 * @param managerId - Manager/employee ID
 * @param companyId - Company ID
 * @returns Manager record or null
 */
export async function findManagerByIdAndCompany(
  managerId: number,
  companyId: number
) {
  return await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: managerId,
      FK_company: companyId,
    },
  });
}

/**
 * Find manager-warehouse assignment
 * @param managerId - Manager ID
 * @param warehouseId - Warehouse ID
 * @returns Assignment record or null
 */
export async function findManagerWarehouseAssignment(
  managerId: number,
  warehouseId: number
) {
  return await prisma.tbmanager_warehouses.findUnique({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: managerId,
        FK_warehouse: warehouseId,
      },
    },
  });
}

/**
 * Count manager assignments for warehouse
 * @param warehouseId - Warehouse ID
 * @returns Number of assignments
 */
export async function countManagerAssignmentsForWarehouse(warehouseId: number) {
  return await prisma.tbmanager_warehouses.count({
    where: { FK_warehouse: warehouseId },
  });
}

/**
 * Create manager-warehouse assignment
 * @param managerId - Manager ID
 * @param warehouseId - Warehouse ID
 * @param assignedBy - Employee ID who assigned
 * @returns Created assignment
 */
export async function createManagerWarehouseAssignment(
  managerId: number,
  warehouseId: number,
  assignedBy?: number
) {
  return await prisma.tbmanager_warehouses.create({
    data: {
      FK_employee: managerId,
      FK_warehouse: warehouseId,
      FK_assignedBy: assignedBy,
    },
  });
}

/**
 * Delete manager-warehouse assignment
 * @param managerId - Manager ID
 * @param warehouseId - Warehouse ID
 * @returns Deleted assignment
 */
export async function deleteManagerWarehouseAssignment(
  managerId: number,
  warehouseId: number
) {
  return await prisma.tbmanager_warehouses.delete({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: managerId,
        FK_warehouse: warehouseId,
      },
    },
  });
}
