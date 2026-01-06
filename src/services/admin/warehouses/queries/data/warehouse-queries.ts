"use server";

import {
  findWarehousesWithRelationsByCompany,
  findWarehouseWithRelationsByIdAndCompany,
} from "../../repos";
import { validateCompanyExists } from "../../services/validation";
import {
  transformWarehousesWithRelations,
  transformWarehouseWithRelations,
} from "../../services/logic";
import type { WarehouseWithRelations } from "../../types/entities/warehouse";

/**
 * Get all warehouses for a company with relations
 * @param tenantId - Company slug/tenant identifier
 * @returns Array of warehouses with managers and branches
 */
export async function getWarehousesByCompany(
  tenantId: string
): Promise<WarehouseWithRelations[]> {
  const company = await validateCompanyExists(tenantId);
  const dbWarehouses = await findWarehousesWithRelationsByCompany(
    company.PK_company
  );
  return transformWarehousesWithRelations(dbWarehouses);
}

/**
 * Get a specific warehouse by ID for a company with relations
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID
 * @returns Warehouse with relations or null if not found
 */
export async function getWarehouseById(
  tenantId: string,
  warehouseId: number
): Promise<WarehouseWithRelations | null> {
  const company = await validateCompanyExists(tenantId);
  const dbWarehouse = await findWarehouseWithRelationsByIdAndCompany(
    warehouseId,
    company.PK_company
  );

  if (!dbWarehouse) {
    return null;
  }

  return transformWarehouseWithRelations(dbWarehouse);
}
