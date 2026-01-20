import { prisma } from "@/lib/prisma";

export async function getSuppliersByCompany(tenantId: string) {
  return await prisma.tbsuppliers.findMany({
    where: {
      company: {
        slug: tenantId,
      },
      deletedAt: null,
    },
    include: {
      supplierManagers: {
        include: {
          manager: {
            include: {
              auth: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
      updatedBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
