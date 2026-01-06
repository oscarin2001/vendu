"use server";

import { getAuditService } from "@/services/shared/audit";
import { updateWarehouse } from "../../repos/data/warehouse-crud-repository";
import {
  validateCompanyExists,
  validateWarehouseExists,
} from "../../services/validation";
import { normalizeWarehouseInput } from "../../services/logic";
import type { UpdateWarehouseData } from "../../validations/types/warehouse-validation-types";
import type { Warehouse } from "../../types/entities/warehouse";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update an existing warehouse for a company
 * @param tenantId - Company slug/tenant identifier
 * @param warehouseId - Warehouse ID to update
 * @param data - Validated warehouse update data
 * @param context - User context for auditing
 * @returns Updated warehouse
 */
export async function updateWarehouseForCompany(
  tenantId: string,
  warehouseId: number,
  data: UpdateWarehouseData,
  context?: UserContext
): Promise<Warehouse> {
  const company = await validateCompanyExists(tenantId);
  const existingWarehouse = await validateWarehouseExists(
    warehouseId,
    company.PK_company
  );

  const normalizedData = normalizeWarehouseInput(data);

  const warehouse = await updateWarehouse(warehouseId, {
    ...normalizedData,
    updatedBy: context?.employeeId,
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouse.PK_warehouse,
      action: "UPDATE",
      oldValue: {
        name: existingWarehouse.name,
        address: existingWarehouse.address,
        city: existingWarehouse.city,
      },
      newValue: {
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
      },
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return {
    id: warehouse.PK_warehouse,
    name: warehouse.name,
    phone: warehouse.phone ?? undefined,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department ?? undefined,
    country: warehouse.country ?? undefined,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}
