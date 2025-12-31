"use server";

import { prisma } from "@/lib/prisma";

export async function getBranchesByCompany(tenantId: string) {
  const branches = await prisma.tbbranches.findMany({
    where: {
      company: {
        slug: tenantId,
      },
    },
    include: {
      tbemployee_profiles: {
        where: {
          auth: {
            privilege: {
              privilegeCode: "BRANCH_MANAGER",
            },
          },
          deletedAt: null, // Solo incluir empleados no eliminados
        },
        include: {
          auth: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return branches.map((branch: any) => ({
    id: branch.PK_branch,
    name: branch.name,
    isWarehouse: branch.isWarehouse,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
    openingHours: branch.openingHours,
    managers: branch.tbemployee_profiles.map((employee: any) => ({
      id: employee.PK_employee,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.auth.username,
    })),
    manager: branch.tbemployee_profiles[0]
      ? {
          id: branch.tbemployee_profiles[0].PK_employee,
          name: `${branch.tbemployee_profiles[0].firstName} ${branch.tbemployee_profiles[0].lastName}`,
          email: branch.tbemployee_profiles[0].auth.username,
        }
      : null,
    createdAt: branch.createdAt,
  }));
}
