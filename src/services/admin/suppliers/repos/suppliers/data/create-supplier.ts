import { prisma } from "@/lib/prisma";

export async function createSupplier(data: {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string | null;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  FK_company?: number;
}) {
  return await prisma.tbsuppliers.create({
    data,
  });
}
