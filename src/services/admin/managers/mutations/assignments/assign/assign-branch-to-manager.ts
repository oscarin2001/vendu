"use server";

import { prisma } from "@/lib/prisma";

/**
 * Assign a branch to a manager
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID
 * @param branchId - The branch ID to assign
 * @returns Success confirmation
 * @throws Error if assignment already exists or validation fails
 */
export async function assignBranchToManager(
  tenantId: string,
  managerId: number,
  branchId: number
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verificar que el manager existe y pertenece a la compañía
  const manager = await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: managerId,
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
      },
      deletedAt: null,
    },
  });

  if (!manager) {
    throw new Error("Manager not found or does not have the required role");
  }

  // Verificar que la branch existe y pertenece a la compañía
  const branch = await prisma.tbbranches.findFirst({
    where: {
      PK_branch: branchId,
      company: {
        slug: tenantId,
      },
    },
  });

  if (!branch) {
    throw new Error("Branch not found");
  }

  // Verificar que la asignación no existe ya
  const existing = await prisma.tbmanager_branches.findFirst({
    where: {
      FK_manager: managerId,
      FK_branch: branchId,
    },
  });

  if (existing) {
    throw new Error("Manager is already assigned to this branch");
  }

  const assignment = await prisma.tbmanager_branches.create({
    data: {
      FK_manager: managerId,
      FK_branch: branchId,
    },
  });

  return {
    id: assignment.PK_manager_branch,
    managerId: assignment.FK_manager,
    branchId: assignment.FK_branch,
    assignedAt: assignment.assignedAt,
  };
}
