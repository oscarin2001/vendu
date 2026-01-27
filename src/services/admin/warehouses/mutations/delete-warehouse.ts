"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "@/services/admin/managers";
import { getAuthCookie } from "@/services/auth/adapters";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Delete a warehouse for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param warehouseId - The warehouse ID to delete
 * @param password - Admin password for confirmation
 * @param context - User context for auditing
 * @returns Success confirmation
 * @throws Error if warehouse has active assignments
 */
export async function deleteWarehouse(
  tenantId: string,
  warehouseId: number,
  password: string,
  context?: UserContext,
) {
  // If no explicit employee context is provided, try to resolve the
  // authenticated user from the server cookie (session) so password
  // validation is always performed against the real logged-in user.
  let employeeIdToValidate = context?.employeeId;

  if (!employeeIdToValidate) {
    try {
      const auth = await getAuthCookie();
      if (auth?.userId) {
        employeeIdToValidate = auth.userId;
      }
    } catch (err) {
      // ignore and fallback to existing behavior (will try other admin fallbacks)
    }
  }

  // Validate password of the current user (resolved from context or cookie)
  await validateAdminPassword({
    tenantId,
    employeeId: employeeIdToValidate,
    password,
  });

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

  // Check if warehouse has any assignments
  const managerAssignments = await prisma.tbmanager_warehouses.count({
    where: { FK_warehouse: warehouseId },
  });

  const branchAssignments = await prisma.tbwarehouse_branches.count({
    where: { FK_warehouse: warehouseId },
  });

  if (managerAssignments > 0 || branchAssignments > 0) {
    throw new Error(
      "No se puede eliminar la bodega con asignaciones activas. Remueva todas las asignaciones de gerentes y sucursales primero.",
    );
  }

  await prisma.tbwarehouses.delete({
    where: { PK_warehouse: warehouseId },
  });

  // Audit log
  if (context?.employeeId) {
    await getAuditService().log({
      entity: "WAREHOUSE",
      entityId: warehouseId,
      action: "DELETE",
      oldValue: {
        name: existingWarehouse.name,
        address: existingWarehouse.address,
        city: existingWarehouse.city,
      },
      newValue: null,
      employeeId: context.employeeId,
      companyId: company.PK_company,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  return { success: true };
}
