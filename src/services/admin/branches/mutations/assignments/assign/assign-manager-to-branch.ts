"use server";

import { prisma } from "@/lib/prisma";

/**
 * Assign a manager to a branch
 * @param branchId - The branch ID
 * @param employeeId - The employee ID to assign as manager
 * @returns Success confirmation
 * @throws Error if employee is not a manager or already assigned
 */
export async function assignManagerToBranch(
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

  // Verificar que no esté ya asignado a esta sucursal
  const existingAssignment = await prisma.tbmanager_branches.findUnique({
    where: {
      FK_manager_FK_branch: {
        FK_manager: employeeId,
        FK_branch: branchId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("Manager is already assigned to this branch");
  }

  // Crear la asignación en la tabla intermedia
  await prisma.tbmanager_branches.create({
    data: {
      FK_manager: employeeId,
      FK_branch: branchId,
    },
  });

  return { success: true };
}
