"use server";

import { prisma } from "@/lib/prisma";
import { mapManagerFromDB } from "../../mappers/manager-mapper";

/**
 * Get a specific manager by ID
 * @param managerId - The manager ID
 * @returns Manager data or null if not found
 */
export async function getManagerById(managerId: number) {
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
      managerBranches: {
        include: {
          branch: true,
        },
      },
    },
  });

  if (!employee) {
    return null;
  }

  return mapManagerFromDB(employee);
}
