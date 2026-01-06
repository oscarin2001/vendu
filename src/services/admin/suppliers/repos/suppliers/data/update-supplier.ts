import { prisma } from "@/lib/prisma";

export async function updateSupplier(
  supplierId: number,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    department?: string;
    country?: string;
    notes?: string;
  }
) {
  return await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data,
  });
}
