import { prisma } from "@/lib/prisma";

export async function assignManagerToSupplier(
  supplierId: number,
  managerId: number
) {
  return await prisma.tbsupplier_managers.create({
    data: {
      FK_supplier: supplierId,
      FK_manager: managerId,
    },
  });
}
