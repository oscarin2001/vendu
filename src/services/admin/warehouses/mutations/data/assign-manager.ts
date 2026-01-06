"use server";

import {
  createManagerWarehouseAssignment,
  deleteManagerWarehouseAssignment,
} from "../../repos/data/manager-assignment-repository";
import {
  validateCompanyExists,
  validateWarehouseExists,
  validateManagerExists,
} from "../../services/validation";
import {
  validateManagerNotAssigned,
  validateManagerAssignmentExists,
} from "../../services/validation";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Assign a manager to a warehouse
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID
 * @param managerId - Manager/employee ID
 * @param context - User context for auditing
 * @returns Assignment details
 */
export async function assignManagerToWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext
) {
  const company = await validateCompanyExists(tenantId);

  // Validate entities exist
  await validateWarehouseExists(warehouseId, company.PK_company);
  await validateManagerExists(managerId, company.PK_company);

  // Validate not already assigned
  await validateManagerNotAssigned(managerId, warehouseId);

  const assignment = await createManagerWarehouseAssignment(
    managerId,
    warehouseId,
    context?.employeeId
  );

  return {
    id: assignment.PK_manager_warehouse,
    warehouseId: assignment.FK_warehouse,
    managerId: assignment.FK_employee,
    assignedAt: assignment.assignedAt,
  };
}

/**
 * Remove a manager from a warehouse
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID
 * @param managerId - Manager/employee ID
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function removeManagerFromWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext
) {
  const company = await validateCompanyExists(tenantId);

  // Validate entities exist
  await validateWarehouseExists(warehouseId, company.PK_company);
  await validateManagerExists(managerId, company.PK_company);

  // Validate assignment exists
  await validateManagerAssignmentExists(managerId, warehouseId);

  await deleteManagerWarehouseAssignment(managerId, warehouseId);

  return { success: true };
}
