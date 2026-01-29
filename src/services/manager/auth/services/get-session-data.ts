"use server";

import { prisma } from "@/lib/prisma";
import type { ManagerSession } from "../types";

/**
 * Obtiene los datos completos de la sesión del manager
 */
export async function getManagerSessionData(
  authId: number
): Promise<ManagerSession | null> {
  const auth = await prisma.tbauth.findUnique({
    where: { PK_auth: authId },
    include: {
      employeeProfile: {
        include: {
          company: true,
          managerBranches: {
            include: {
              branch: true,
            },
          },
          managerWarehouses: {
            include: {
              warehouse: true,
            },
          },
        },
      },
    },
  });

  if (!auth?.employeeProfile) {
    return null;
  }

  const profile = auth.employeeProfile;
  const tenantId = profile.company?.slug || "";

  const branches = profile.managerBranches.map((mb) => ({
    id: mb.branch.PK_branch,
    name: mb.branch.name,
    address: mb.branch.address || "",
  }));

  const warehouses = profile.managerWarehouses.map((mw) => ({
    id: mw.warehouse.PK_warehouse,
    name: mw.warehouse.name,
    city: mw.warehouse.city || "",
  }));

  return {
    managerId: profile.PK_employee,
    authId: auth.PK_auth,
    email: auth.username,
    tenantId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    branches,
    warehouses,
  };
}
