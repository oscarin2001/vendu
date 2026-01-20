import { prisma } from "@/lib/prisma";

export async function createSupplier(data: {
  firstName: string;
  lastName: string;
  ci?: string;
  phone?: string;
  email?: string | null;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  birthDate?: Date | null;
  partnerSince?: Date | null;
  FK_company?: number;
  FK_createdBy?: number;
}) {
  return await prisma.tbsuppliers.create({
    data,
  });
}
