"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Toggle manager status between ACTIVE and DEACTIVATED
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID to toggle status
 * @param context - User context for auditing
 * @returns Success confirmation with new status
 */
export async function toggleManagerStatus(
  tenantId: string,
  managerId: number,
  context?: UserContext
) {
  // Obtener la compañía para validación
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    select: { PK_company: true },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Obtener el manager actual
  const manager = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: { auth: true },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Verificar que el manager pertenece a la compañía
  if (manager.FK_company !== company.PK_company) {
    throw new Error("Manager does not belong to this company");
  }

  // Determinar el nuevo estado
  let newStatus: "ACTIVE" | "DEACTIVATED";
  let auditAction: "CREATE" | "UPDATE";

  if (manager.status === "ACTIVE") {
    // De ACTIVE a DEACTIVATED
    newStatus = "DEACTIVATED";
    auditAction = "UPDATE";
  } else if (manager.status === "DEACTIVATED") {
    // De DEACTIVATED a ACTIVE
    newStatus = "ACTIVE";
    auditAction = "CREATE";
  } else {
    // INACTIVE no se puede cambiar con toggle
    throw new Error("No se puede cambiar el estado de un manager inactivo");
  }

  // Actualizar el status en la base de datos
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: { status: newStatus },
  });

  // Registrar en auditoría
  const auditService = getAuditService(prisma);
  await auditService.log({
    entity: "tbemployee_profiles",
    entityId: managerId,
    action: auditAction,
    oldValue: {
      status: manager.status,
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    newValue: {
      status: newStatus,
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    employeeId: context?.employeeId || 1, // TODO: Get from session
    companyId: company.PK_company,
  });

  return { success: true, newStatus };
}
