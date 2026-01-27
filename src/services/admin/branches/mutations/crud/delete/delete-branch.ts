"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "@/services/admin/managers";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Delete a branch for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param branchId - The branch ID to delete
 * @param password - Admin password for confirmation
 * @param context - User context for auditing
 * @returns Success confirmation
 * @throws Error if branch has active employees
 */
export async function deleteBranch(
  tenantId: string,
  branchId: number,
  password: string,
  context?: UserContext,
) {
  // Validate password of the current user
  await validateAdminPassword({
    tenantId,
    employeeId: context?.employeeId,
    password,
  });

  // Obtener valores anteriores para auditoría
  const oldBranch = await prisma.tbbranches.findUnique({
    where: { PK_branch: branchId },
  });

  if (!oldBranch) {
    throw new Error("Branch not found");
  }

  // Verificar que no haya empleados activos en la sucursal
  const employeesCount = await prisma.tbemployee_profiles.count({
    where: {
      FK_branch: branchId,
      deletedAt: null,
    },
  });

  if (employeesCount > 0) {
    throw new Error("Cannot delete branch with active employees");
  }

  await prisma.tbbranches.delete({
    where: { PK_branch: branchId },
  });

  // Registrar auditoría
  const auditService = getAuditService(prisma);
  await auditService.logDelete(
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
    },
    {
      employeeId: context?.employeeId,
      companyId: oldBranch.FK_company || undefined,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    },
  );

  return { success: true };
}
