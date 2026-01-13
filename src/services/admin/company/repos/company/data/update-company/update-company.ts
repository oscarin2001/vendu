import { prisma } from "@/lib/prisma";

export async function updateCompany(
  companyId: number,
  data: {
    name?: string;
    taxId?: string | null;
    taxIdPath?: string | null;
    businessName?: string | null;
    fiscalAddress?: string | null;
    country?: string | null;
    department?: string | null;
    commerceType?: string | null;
    description?: string | null;
    vision?: string | null;
    mission?: string | null;
  }
) {
  return await prisma.tbcompanies.update({
    where: { PK_company: companyId },
    data,
  });
}
