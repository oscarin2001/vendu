"use server";

import { getAuditService } from "@/services/shared/audit";
import { prisma } from "@/lib/prisma";
import { updateWarehouse } from "../../repos/data/warehouse-crud-repository";
import { validateAdminPassword } from "@/services/admin/managers";
import { getAuthCookie } from "@/services/auth/adapters";
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
  context?: UserContext,
): Promise<Warehouse> {
  const company = await validateCompanyExists(tenantId);
  const existingWarehouse = await validateWarehouseExists(
    warehouseId,
    company.PK_company,
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
      // Resolve employeeId from provided context or from the authenticated
      // session cookie so validation runs against the real logged-in user.
      let employeeIdToValidate = context?.employeeId;
      if (!employeeIdToValidate) {
        try {
          const auth = await getAuthCookie();
          if (auth?.userId) employeeIdToValidate = auth.userId;
        } catch (err) {
          // fallback: continue and let validateAdminPassword apply its own fallbacks
        }
      }

      await validateAdminPassword({
        tenantId,
        employeeId: employeeIdToValidate,
        password: confirmPassword,
      });
    } catch (err: any) {
      const e = new Error(err?.message || "La contraseña no coincide");
      e.name = "ValidationError";
      throw e;
    }
  }

  const warehouse = await updateWarehouse(warehouseId, {
    ...normalizedData,
    openedAt: (data as any).openedAt,
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
    openedAt: warehouse.openedAt,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}
