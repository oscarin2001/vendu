"use server";

import { prisma } from "@/lib/prisma";
import { normalizeWarehouseInput } from "../utils/warehouse-utils";
import { getAuditService } from "@/services/shared/audit";
import {
  updateWarehouseSchema,
  type UpdateWarehouseData,
} from "../validations/warehouse-schema";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update an existing warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID to update
 * @param data - Warehouse update data (partial)
 * @param context - User context for auditing
 * @returns Updated warehouse data
 */
export async function updateWarehouse(
  tenantId: string,
  warehouseId: number,
  data: UpdateWarehouseData,
  context?: UserContext
) {
  const validatedData = updateWarehouseSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const existingWarehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: warehouseId,
      FK_company: company.PK_company,
    },
  });

  if (!existingWarehouse) {
    throw new Error("Warehouse not found");
  }

  const normalizedData = normalizeWarehouseInput(validatedData);

  const warehouse = await prisma.tbwarehouses.update({
    where: { PK_warehouse: warehouseId },
    data: {
      name: normalizedData.name,
      phone: normalizedData.phone,
      address: normalizedData.address,
      city: normalizedData.city,
      department: normalizedData.department,
      country: validatedData.country,
      FK_updatedBy: context?.employeeId,
    },
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
    phone: warehouse.phone,
    address: warehouse.address,
    city: warehouse.city,
    department: warehouse.department,
    country: warehouse.country,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}
