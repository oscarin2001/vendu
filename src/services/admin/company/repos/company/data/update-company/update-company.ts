import { prisma } from "@/lib/prisma";

export async function updateCompany(
  companyId: number,
  data: {
    name?: string;
    taxId?: string | null;
    country?: string | null;
  }
) {
  return await prisma.tbcompanies.update({
    where: { PK_company: companyId },
    data,
  });
}
