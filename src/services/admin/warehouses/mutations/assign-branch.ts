"use server";

import { prisma } from "@/lib/prisma";
import {
  assignBranchSchema,
  type AssignBranchData,
} from "../validations/warehouse-schema";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Assign a warehouse to a branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param branchId - The branch ID
 * @param isPrimary - Whether this is the primary warehouse for the branch
 * @param context - User context for auditing
 * @returns Assignment details
 */
export async function assignWarehouseToBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  isPrimary: boolean = false,
  context?: UserContext
) {
  // Validate input data
  const validatedData: AssignBranchData = assignBranchSchema.parse({
    tenantId,
    warehouseId,
    branchId,
    isPrimary,
  });

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: validatedData.tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify warehouse and branch belong to company
  const [warehouse, branch] = await Promise.all([
    prisma.tbwarehouses.findFirst({
      where: {
        PK_warehouse: validatedData.warehouseId,
        FK_company: company.PK_company,
      },
    }),
    prisma.tbbranches.findFirst({
      where: {
        PK_branch: validatedData.branchId,
        FK_company: company.PK_company,
      },
    }),
  ]);

  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  if (!branch) {
    throw new Error("Branch not found");
  }

  // Check if already assigned
  const existing = await prisma.tbwarehouse_branches.findUnique({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: validatedData.warehouseId,
        FK_branch: validatedData.branchId,
      },
    },
  });

  if (existing) {
    throw new Error("Warehouse is already assigned to this branch");
  }

  // If setting as primary, remove other primary assignments for this branch
  if (validatedData.isPrimary) {
    await prisma.tbwarehouse_branches.updateMany({
      where: { FK_branch: validatedData.branchId },
      data: { isPrimary: false },
    });
  }

  const assignment = await prisma.tbwarehouse_branches.create({
    data: {
      FK_warehouse: validatedData.warehouseId,
      FK_branch: validatedData.branchId,
      isPrimary: validatedData.isPrimary,
      FK_assignedBy: context?.employeeId,
    },
  });

  return {
    id: assignment.PK_warehouse_branch,
    warehouseId: assignment.FK_warehouse,
    branchId: assignment.FK_branch,
    isPrimary: assignment.isPrimary,
    assignedAt: assignment.assignedAt,
  };
}

/**
 * Remove a warehouse from a branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID
 * @param branchId - The branch ID
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function removeWarehouseFromBranch(
  tenantId: string,
  warehouseId: number,
  branchId: number,
  context?: UserContext
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verify assignment exists
  const assignment = await prisma.tbwarehouse_branches.findUnique({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: warehouseId,
        FK_branch: branchId,
      },
    },
  });

  if (!assignment) {
    throw new Error("Warehouse is not assigned to this branch");
  }

  await prisma.tbwarehouse_branches.delete({
    where: {
      FK_warehouse_FK_branch: {
        FK_warehouse: warehouseId,
        FK_branch: branchId,
      },
    },
  });

  return { success: true };
}
