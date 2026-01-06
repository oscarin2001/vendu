"use server";

import { prisma } from "@/lib/prisma";

/**
 * Remove a branch from a manager
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID
 * @param branchId - The branch ID to remove
 * @returns Success confirmation
 * @throws Error if assignment not found
 */
export async function removeBranchFromManager(
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

  const assignment = await prisma.tbmanager_branches.findFirst({
    where: {
      FK_manager: managerId,
      FK_branch: branchId,
      manager: {
        company: {
          slug: tenantId,
        },
        deletedAt: null,
      },
      branch: {
        company: {
          slug: tenantId,
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await prisma.tbmanager_branches.delete({
    where: { PK_manager_branch: assignment.PK_manager_branch },
  });

  return { success: true };
}
