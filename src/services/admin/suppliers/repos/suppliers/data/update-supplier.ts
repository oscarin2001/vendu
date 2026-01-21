import { prisma } from "@/lib/prisma";

export async function updateSupplier(
  supplierId: number,
  data: {
    firstName?: string;
    lastName?: string;
    ci?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    department?: string;
    country?: string;
    notes?: string;
    birthDate?: Date | null;
    partnerSince?: Date | null;
    contractEndAt?: Date | null;
    isIndefinite?: boolean;
    FK_updatedBy?: number;
  },
) {
  return await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data,
  });
}
