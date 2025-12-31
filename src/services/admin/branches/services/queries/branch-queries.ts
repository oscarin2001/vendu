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
      managerBranches: {
        include: {
          manager: {
            include: {
              auth: {
                include: {
                  privilege: true,
                },
              },
            },
          },
        },
        where: {
          manager: {
            deletedAt: null,
          },
        },
      },
      supplierBranches: {
        include: {
          supplier: true,
        },
        where: {
          supplier: {
            deletedAt: null,
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
    managers: branch.managerBranches.map((mb: any) => ({
      id: mb.manager.PK_employee,
      name: `${mb.manager.firstName} ${mb.manager.lastName}`,
      email: mb.manager.auth.username,
    })),
    suppliers: branch.supplierBranches.map((sb: any) => ({
      id: sb.supplier.PK_supplier,
      supplierNumber: sb.supplier.supplierNumber,
      name: `${sb.supplier.firstName} ${sb.supplier.lastName}`,
      email: sb.supplier.email,
    })),
    manager: branch.managerBranches[0]
      ? {
          id: branch.managerBranches[0].manager.PK_employee,
          name: `${branch.managerBranches[0].manager.firstName} ${branch.managerBranches[0].manager.lastName}`,
          email: branch.managerBranches[0].manager.auth.username,
        }
      : null,
    createdAt: branch.createdAt,
    updatedAt: branch.updatedAt,
  }));
}
