"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { UpdateBranchData } from "../../../validations/types/inferred.types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update an existing branch
 * @param tenantId - The company slug/tenant identifier
 * @param branchId - The branch ID to update
 * @param data - Branch update data
 * @param context - User context for auditing
 * @returns Updated branch information
 */
export async function updateBranch(
  tenantId: string,
  branchId: number,
  data: UpdateBranchData,
  context?: UserContext,
) {
  // Obtener valores anteriores para auditoría
  const oldBranch = await prisma.tbbranches.findUnique({
    where: { PK_branch: branchId },
  });

  if (!oldBranch) {
    throw new Error("Branch not found");
  }

  const branch = await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data: {
      ...data,
      FK_updatedBy: context?.employeeId,
    },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logUpdate(
    "BRANCH",
    branchId,
    {
      name: oldBranch.name,
      phone: oldBranch.phone,
      address: oldBranch.address,
      city: oldBranch.city,
      department: oldBranch.department,
      country: oldBranch.country,
      latitude: oldBranch.latitude,
      longitude: oldBranch.longitude,
      openedAt: oldBranch.openedAt,
    },
    {
      name: branch.name,
      phone: branch.phone,
      address: branch.address,
      city: branch.city,
      department: branch.department,
      country: branch.country,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openedAt: branch.openedAt,
    },
    {
      employeeId: context?.employeeId,
      companyId: oldBranch.FK_company || undefined,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    },
  );

  return {
    id: branch.PK_branch,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
  };
}
