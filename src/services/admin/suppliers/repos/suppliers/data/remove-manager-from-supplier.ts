import { prisma } from "@/lib/prisma";

export async function removeManagerFromSupplier(
  supplierId: number,
  managerId: number
) {
  const assignment = await prisma.tbsupplier_managers.findFirst({
    where: {
      FK_supplier: supplierId,
      FK_manager: managerId,
      supplier: {
        deletedAt: null,
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return await prisma.tbsupplier_managers.delete({
    where: { PK_supplier_manager: assignment.PK_supplier_manager },
  });
}
