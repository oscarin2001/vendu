"use server";

import { getAuditService } from "@/services/shared/audit";
import { prisma } from "@/lib/prisma";
import { updateWarehouse } from "../../repos/data/warehouse-crud-repository";
import { validateAdminPassword } from "@/services/admin/managers";
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

  // extract possible confirmation password and change reason, validate if provided
  const maybeData: any = { ...(data as any) };
  const confirmPassword: string | undefined = maybeData._confirmPassword;
  const changeReason: string | undefined = maybeData._changeReason;
  if (maybeData._confirmPassword) delete maybeData._confirmPassword;
  if (maybeData._changeReason) delete maybeData._changeReason;
  if (confirmPassword) {
    try {
      await validateAdminPassword({ tenantId, employeeId: context?.employeeId, password: confirmPassword });
    } catch (err: any) {
      const e = new Error(err?.message || "La contraseña no coincide");
      e.name = "ValidationError";
      throw e;
    }
  }

  const warehouse = await updateWarehouse(warehouseId, {
    ...normalizedData,
    updatedBy: context?.employeeId,
  });

  // Audit log (include change reason if present)
  if (context?.employeeId) {
    try {
      const auditService = getAuditService(prisma);
      const newValue: Record<string, any> = {
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
      };
      if (changeReason) {
        newValue._changeReason = changeReason;
        newValue._changedAt = new Date().toISOString();
      }

      await auditService.logUpdate(
        "WAREHOUSE",
        warehouse.PK_warehouse,
        {
          name: existingWarehouse.name,
          address: existingWarehouse.address,
          city: existingWarehouse.city,
        },
        newValue,
        {
          employeeId: context.employeeId,
          companyId: company.PK_company,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        },
      );
    } catch (err) {
      console.error("Warehouse audit log error:", err);
    }
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
