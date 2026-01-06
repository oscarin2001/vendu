"use server";

import { getAuditService } from "@/services/shared/audit";
import { deleteWarehouse } from "../../repos/data/warehouse-crud-repository";
import {
  validateCompanyExists,
  validateWarehouseExists,
} from "../../services/validation";
import { validateWarehouseCanBeDeleted } from "../../services/validation";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Delete a warehouse for a company
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID to delete
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function deleteWarehouseForCompany(
  tenantId: string,
  warehouseId: number,
  context?: UserContext
): Promise<{ success: boolean }> {
  const company = await validateCompanyExists(tenantId);
  const existingWarehouse = await validateWarehouseExists(
    warehouseId,
    company.PK_company
  );

  // Validate warehouse can be deleted
  await validateWarehouseCanBeDeleted(warehouseId);

  await deleteWarehouse(warehouseId);

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouseId,
      action: "DELETE",
      oldValue: {
        name: existingWarehouse.name,
        address: existingWarehouse.address,
        city: existingWarehouse.city,
      },
      newValue: null,
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return { success: true };
}
