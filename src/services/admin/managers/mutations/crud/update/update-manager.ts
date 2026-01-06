"use server";

import { prisma } from "@/lib/prisma";
import { UpdateManagerData } from "../../../validations/types/inferred.types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update an existing manager
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID to update
 * @param data - Manager update data
 * @param context - User context for auditing
 * @returns Updated manager information
 */
export async function updateManager(
  tenantId: string,
  managerId: number,
  data: UpdateManagerData,
  context?: UserContext
) {
  // Separar los campos que van a diferentes tablas
  const { branchIds, email, password, contributionType, ...restEmployeeData } =
    data;

  // Transformar contributionType a mayúsculas para coincidir con el enum de Prisma
  const employeeData = {
    ...restEmployeeData,
    ...(contributionType && {
      contributionType: contributionType.toUpperCase() as
        | "NONE"
        | "CONTRIBUTES"
        | "PAID",
    }),
  };

  // Actualizar los datos básicos del empleado
  const employee = await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: employeeData,
  });

  // Actualizar el email en tbauth si se proporcionó
  if (email !== undefined) {
    await prisma.tbauth.update({
      where: { PK_auth: employee.FK_auth },
      data: { username: email },
    });
  }

  // Actualizar el password en tbauth si se proporcionó
  if (password !== undefined && password.trim() !== "") {
    await prisma.tbauth.update({
      where: { PK_auth: employee.FK_auth },
      data: { password: password },
    });
  }

  // Manejar la asignación/desasignación de sucursales
  if (branchIds !== undefined) {
    // Obtener sucursales actualmente asignadas a este manager
    const currentManagerBranches = await prisma.tbmanager_branches.findMany({
      where: {
        FK_manager: managerId,
      },
      select: {
        FK_branch: true,
      },
    });

    const currentBranchIds = currentManagerBranches.map((mb) => mb.FK_branch);

    // Sucursales a desasignar (están en current pero no en branchIds)
    const branchesToUnassign = currentBranchIds.filter(
      (id) => !branchIds.includes(id)
    );

    // Sucursales a asignar (están en branchIds pero no en current)
    const branchesToAssign = branchIds.filter(
      (id) => !currentBranchIds.includes(id)
    );

    // Desasignar sucursales que ya no están en la lista
    if (branchesToUnassign.length > 0) {
      await prisma.tbmanager_branches.deleteMany({
        where: {
          FK_manager: managerId,
          FK_branch: {
            in: branchesToUnassign,
          },
        },
      });
    }

    // Asignar sucursales nuevas
    if (branchesToAssign.length > 0) {
      const managerBranchData = branchesToAssign.map((branchId) => ({
        FK_manager: managerId,
        FK_branch: branchId,
      }));

      await prisma.tbmanager_branches.createMany({
        data: managerBranchData,
      });
    }
  }

  // Obtener el email actualizado del auth
  const updatedAuth = await prisma.tbauth.findUnique({
    where: { PK_auth: employee.FK_auth },
    select: { username: true },
  });

  return {
    id: employee.PK_employee,
    firstName: employee.firstName,
    lastName: employee.lastName,
    ci: employee.ci,
    phone: employee.phone,
    salary: Number(employee.salary),
    email: updatedAuth?.username,
    branchIds: branchIds || [],
  };
}
