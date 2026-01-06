"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "../../security/validate-admin-password";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Delete a manager for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID to delete
 * @param password - Admin password for confirmation
 * @param context - User context for auditing
 * @returns Success confirmation
 */
export async function deleteManager(
  tenantId: string,
  managerId: number,
  password: string,
  context?: UserContext
) {
  // Validate admin password first
  await validateAdminPassword(tenantId, "", password);

  const auditService = getAuditService(prisma);

  // Obtener el manager antes de eliminarlo para la auditoría
  const manager = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: { auth: true },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Soft delete
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: {
      deletedAt: new Date(),
    },
  });

  // Registrar en auditoría
  await auditService.log({
    entity: "tbemployee_profiles",
    entityId: managerId,
    action: "DELETE",
    oldValue: {
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    newValue: null,
    employeeId: context?.employeeId,
    companyId: context?.companyId,
  });

  return { success: true };
}
