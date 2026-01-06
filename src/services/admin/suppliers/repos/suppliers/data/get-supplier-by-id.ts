import { prisma } from "@/lib/prisma";

export async function getSupplierById(supplierId: number) {
  return await prisma.tbsuppliers.findUnique({
    where: { PK_supplier: supplierId },
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
    },
  });
}
