"use server";

import { prisma } from "@/lib/prisma";
import { normalizeWarehouseInput } from "../utils/warehouse-utils";
import { getAuditService } from "@/services/shared/audit";
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  assignManagerSchema,
  assignBranchSchema,
  type CreateWarehouseData,
  type UpdateWarehouseData,
  type AssignManagerData,
  type AssignBranchData,
} from "../validations/warehouse-schema";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param data - Warehouse creation data
 * @param context - User context for auditing
 * @returns Created warehouse data
 */
export async function createWarehouse(
  tenantId: string,
  data: CreateWarehouseData,
  context?: UserContext,
) {
  const validatedData = createWarehouseSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const normalizedData = normalizeWarehouseInput(validatedData);

  const warehouse = await prisma.tbwarehouses.create({
    data: {
      FK_company: company.PK_company,
      name: normalizedData.name!,
      phone: normalizedData.phone,
      address: normalizedData.address,
      city: normalizedData.city,
      department: normalizedData.department,
      country: validatedData.country,
      openedAt: validatedData.openedAt, // Fecha de apertura de la bodega
      FK_createdBy: context?.employeeId,
    },
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouse.PK_warehouse,
      action: "CREATE",
      oldValue: null,
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
    openedAt: warehouse.openedAt,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt || undefined,
  };
}
