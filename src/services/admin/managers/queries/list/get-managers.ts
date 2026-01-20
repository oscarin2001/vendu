"use server";

import { prisma } from "@/lib/prisma";
import { mapManagerFromDB } from "../../mappers/manager-mapper";

/**
 * Get all managers for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @returns Array of managers with branch assignments
 */
export async function getManagersByCompany(tenantId: string) {
  // Obtener la compañía para tener el ID
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    select: { PK_company: true },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const managers = await prisma.tbemployee_profiles.findMany({
    where: {
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
      },
    },
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
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      hireDate: "desc",
    },
  });

  return managers.map(mapManagerFromDB);
}
