"use server";

import {
  findCompanyBySlug,
  findWarehouseByIdAndCompany,
  findManagerByIdAndCompany,
  findBranchByIdAndCompany,
} from "../../repos";

/**
 * Validate company exists
 * @param tenantId - Company slug
 * @throws Error if company not found
 */
export async function validateCompanyExists(tenantId: string) {
  const company = await findCompanyBySlug(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
}

/**
 * Validate warehouse exists and belongs to company
 * @param warehouseId - Warehouse ID
 * @param companyId - Company ID
 * @throws Error if warehouse not found
 */
export async function validateWarehouseExists(
  warehouseId: number,
  companyId: number
) {
  const warehouse = await findWarehouseByIdAndCompany(warehouseId, companyId);
  if (!warehouse) {
    throw new Error("Warehouse not found");
  }
  return warehouse;
}

/**
 * Validate manager exists and belongs to company
 * @param managerId - Manager ID
 * @param companyId - Company ID
 * @throws Error if manager not found
 */
export async function validateManagerExists(
  managerId: number,
  companyId: number
) {
  const manager = await findManagerByIdAndCompany(managerId, companyId);
  if (!manager) {
    throw new Error("Manager not found");
  }
  return manager;
}

/**
 * Validate branch exists and belongs to company
 * @param branchId - Branch ID
 * @param companyId - Company ID
 * @throws Error if branch not found
 */
export async function validateBranchExists(
  branchId: number,
  companyId: number
) {
  const branch = await findBranchByIdAndCompany(branchId, companyId);
  if (!branch) {
    throw new Error("Branch not found");
  }
  return branch;
}
