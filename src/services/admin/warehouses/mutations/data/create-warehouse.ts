"use server";

import { getAuditService } from "@/services/shared/audit";
import { createWarehouse } from "../../repos/data/warehouse-crud-repository";
import { validateCompanyExists } from "../../services/validation";
import { normalizeWarehouseInput } from "../../services/logic";
import type { CreateWarehouseData } from "../../validations/types/warehouse-validation-types";
import type { Warehouse } from "../../types/entities/warehouse";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new warehouse for a company
 * @param tenantId - Company slug/tenant identifier
 * @param data - Validated warehouse creation data
 * @param context - User context for auditing
 * @returns Created warehouse
 */
export async function createWarehouseForCompany(
  tenantId: string,
  data: CreateWarehouseData,
  context?: UserContext
): Promise<Warehouse> {
  const company = await validateCompanyExists(tenantId);

  const normalizedData = normalizeWarehouseInput(data);

  const warehouse = await createWarehouse({
    ...normalizedData,
    companyId: company.PK_company,
    createdBy: context?.employeeId,
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouse.PK_warehouse,
      action: "CREATE",
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
