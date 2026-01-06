"use server";

import { prisma } from "@/lib/prisma";

/**
 * Remove a manager from a branch
 * @param branchId - The branch ID
 * @param employeeId - The employee ID to remove as manager
 * @returns Success confirmation
 * @throws Error if employee is not a manager or not assigned
 */
export async function removeManagerFromBranch(
  branchId: number,
  employeeId: number
) {
  // Verificar que el empleado existe y es un manager
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: employeeId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Verificar que es un manager
  const isManager = employee.auth.privilege.privilegeCode === "BRANCH_MANAGER";
  if (!isManager) {
    throw new Error("Employee is not a manager");
  }

  // Eliminar la asignación de la tabla intermedia
  await prisma.tbmanager_branches.deleteMany({
    where: {
      FK_manager: employeeId,
      FK_branch: branchId,
    },
  });

  return { success: true };
}
