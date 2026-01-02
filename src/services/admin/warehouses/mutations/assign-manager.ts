"use server";

import { prisma } from "@/lib/prisma";
import { assignManagerSchema, type AssignManagerData } from "../validations/warehouse-schema";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
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
  context?: UserContext
) {
  // Validate input data
  const validatedData: AssignManagerData = assignManagerSchema.parse({
    tenantId,
    warehouseId,
    managerId,
  });

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: validatedData.tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify warehouse belongs to company
  const warehouse = await prisma.tbwarehouses.findFirst({
    where: {
      PK_warehouse: validatedData.warehouseId,
      FK_company: company.PK_company,
    },
  });

  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  // Verify manager belongs to company
  const manager = await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: validatedData.managerId,
      FK_company: company.PK_company,
    },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Check if already assigned
  const existing = await prisma.tbmanager_warehouses.findUnique({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: validatedData.managerId,
        FK_warehouse: validatedData.warehouseId,
      },
    },
  });

  if (existing) {
    throw new Error("Manager is already assigned to this warehouse");
  }

  const assignment = await prisma.tbmanager_warehouses.create({
    data: {
      FK_employee: validatedData.managerId,
      FK_warehouse: validatedData.warehouseId,
      FK_assignedBy: context?.employeeId,
    },
  });

  return {
    id: assignment.PK_manager_warehouse,
    warehouseId: assignment.FK_warehouse,
    managerId: assignment.FK_employee,
    assignedAt: assignment.assignedAt,
  };
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
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify assignment exists
  const assignment = await prisma.tbmanager_warehouses.findUnique({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: managerId,
        FK_warehouse: warehouseId,
      },
    },
  });

  if (!assignment) {
    throw new Error("Manager is not assigned to this warehouse");
  }

  await prisma.tbmanager_warehouses.delete({
    where: {
      FK_employee_FK_warehouse: {
        FK_employee: managerId,
        FK_warehouse: warehouseId,
      },
    },
  });

  return { success: true };
}