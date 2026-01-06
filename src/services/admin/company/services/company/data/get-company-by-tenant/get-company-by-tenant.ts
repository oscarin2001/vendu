"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyByTenant(tenantId: string) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    include: {
      tbsubscriptions: true,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return {
    id: company.PK_company,
    name: company.name,
    slug: company.slug,
    taxId: company.taxId,
    country: company.country,
    createdAt: company.createdAt,
    subscription: company.tbsubscriptions
      ? {
          planType: company.tbsubscriptions.planType,
          status: company.tbsubscriptions.status,
          nextBillingDate: company.tbsubscriptions.nextBillingDate,
        }
      : null,
  };
}
