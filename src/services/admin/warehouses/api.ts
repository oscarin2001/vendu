"use server";

import {
  getWarehousesByCompany as queryGetWarehousesByCompany,
  getWarehouseById as queryGetWarehouseById,
} from "./queries";
import {
  createWarehouseForCompany,
  updateWarehouseForCompany,
  deleteWarehouseForCompany,
  assignManagerToWarehouse as mutateAssignManagerToWarehouse,
  removeManagerFromWarehouse as mutateRemoveManagerFromWarehouse,
  assignWarehouseToBranch as mutateAssignWarehouseToBranch,
  removeWarehouseFromBranch as mutateRemoveWarehouseFromBranch,
} from "./mutations";
import { validateWarehouseAdminPassword } from "./services/validation";
import type {
  CreateWarehouseData,
  UpdateWarehouseData,
} from "./validations/types/warehouse-validation-types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Get all warehouses for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @returns Array of warehouses with managers and branches
 */
export async function getWarehousesByCompany(tenantId: string) {
  return await queryGetWarehousesByCompany(tenantId);
}

/**
 * Get a specific warehouse by ID for a company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @returns Warehouse details or null if not found
 */
export async function getWarehouseById(tenantId: string, warehouseId: number) {
  return await queryGetWarehouseById(tenantId, warehouseId);
}

/**
 * Create a new warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param data - Validated warehouse creation data
 * @param context - User context for auditing
 * @returns Created warehouse
 */
export async function createWarehouse(
  tenantId: string,
  data: CreateWarehouseData,
  context?: UserContext,
) {
  return await createWarehouseForCompany(tenantId, data, context);
}

/**
 * Update an existing warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID to update
 * @param data - Validated warehouse update data
 * @param context - User context for auditing
 * @returns Updated warehouse
 */
export async function updateWarehouse(
  tenantId: string,
  warehouseId: number,
  data: UpdateWarehouseData,
  context?: UserContext,
) {
  return await updateWarehouseForCompany(tenantId, warehouseId, data, context);
}

/**
 * Delete a warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID to delete
 * @param password - Admin password for confirmation
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function deleteWarehouse(
  tenantId: string,
  warehouseId: number,
  password: string,
  context?: UserContext,
) {
  // Validate password of the current user
  await validateWarehouseAdminPassword({
    tenantId,
    employeeId: context?.employeeId,
    password,
  });

  return await deleteWarehouseForCompany(tenantId, warehouseId, context);
}

/**
 * Assign a manager to a warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param managerId - The manager/employee ID
 * @param context - User context for auditing
 * @returns Assignment details
 */
export async function assignManagerToWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext,
) {
  return await mutateAssignManagerToWarehouse(
    tenantId,
    warehouseId,
    managerId,
    context,
  );
}

/**
 * Remove a manager from a warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param managerId - The manager/employee ID
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function removeManagerFromWarehouse(
  tenantId: string,
  warehouseId: number,
  managerId: number,
  context?: UserContext,
) {
  return await mutateRemoveManagerFromWarehouse(
    tenantId,
    warehouseId,
    managerId,
    context,
  );
}

/**
 * Assign a warehouse to a branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param branchId - The branch ID
 * @param isPrimary - Whether this is the primary warehouse for the branch
 * @param context - User context for auditing
 * @returns Assignment details
 */
export async function assignWarehouseToBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  isPrimary: boolean = false,
  context?: UserContext,
) {
  return await mutateAssignWarehouseToBranch(
    tenantId,
    warehouseId,
    branchId,
    isPrimary,
    context,
  );
}

/**
 * Remove a warehouse from a branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param branchId - The branch ID
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function removeWarehouseFromBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  context?: UserContext,
) {
  return await mutateRemoveWarehouseFromBranch(
    tenantId,
    warehouseId,
    branchId,
    context,
  );
}
