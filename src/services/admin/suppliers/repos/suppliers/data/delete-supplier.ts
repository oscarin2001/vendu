import { prisma } from "@/lib/prisma";

export async function deleteSupplier(supplierId: number) {
  // Soft delete
  return await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data: {
      deletedAt: new Date(),
    },
  });
}
