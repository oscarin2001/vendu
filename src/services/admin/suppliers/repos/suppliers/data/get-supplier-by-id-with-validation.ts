import { prisma } from "@/lib/prisma";

export async function getSupplierByIdWithValidation(supplierId: number) {
  return await prisma.tbsuppliers.findFirst({
    where: {
      PK_supplier: supplierId,
      deletedAt: null,
    },
  });
}
