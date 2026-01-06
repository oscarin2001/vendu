import { prisma } from "@/lib/prisma";

export async function checkSupplierManagerAssignmentExists(
  supplierId: number,
  managerId: number
) {
  return await prisma.tbsupplier_managers.findFirst({
    where: {
      FK_supplier: supplierId,
      FK_manager: managerId,
    },
  });
}
