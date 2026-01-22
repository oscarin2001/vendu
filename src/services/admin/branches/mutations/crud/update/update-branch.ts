"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "@/services/admin/managers";
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

  // If client included a change reason, extract it and avoid sending it to Prisma
  const maybeData: any = { ...(data as any) };
  const changeReason: string | undefined = maybeData._changeReason;
  if (maybeData._changeReason) delete maybeData._changeReason;

  // If client provided a confirmation password, validate it and remove it
  const confirmPassword: string | undefined = maybeData._confirmPassword;
  if (maybeData._confirmPassword) delete maybeData._confirmPassword;
  if (confirmPassword) {
    // validate password against current employee when available
    try {
      await validateAdminPassword({ tenantId, employeeId: context?.employeeId, password: confirmPassword });
    } catch (err: any) {
      // Normalize validation error so frontend can detect it
      const e = new Error(err?.message || "La contraseña no coincide");
      e.name = "ValidationError";
      throw e;
    }
  }

  const branch = await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data: {
      ...maybeData,
      FK_updatedBy: context?.employeeId,
    },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  // Prepare newValue for audit; include change reason if provided
  const newValueForAudit: Record<string, unknown> = {
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
    openedAt: branch.openedAt,
  };
  if (changeReason) {
    newValueForAudit._changeReason = changeReason;
    newValueForAudit._changedAt = new Date().toISOString();
  }

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
    newValueForAudit,
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
