"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyByTenant(tenantId: string) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    include: {
      tbsubscriptions: true,
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
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
    department: company.department,
    commerceType: company.commerceType,
    description: company.description,
    vision: company.vision,
    mission: company.mission,
    openedAt: company.openedAt,
    createdAt: company.createdAt,
    owner: company.createdBy
      ? {
          id: company.createdBy.PK_employee,
          firstName: company.createdBy.firstName,
          lastName: company.createdBy.lastName,
          phone: company.createdBy.phone,
        }
      : null,
    subscription: company.tbsubscriptions
      ? {
          planType: company.tbsubscriptions.planType,
          status: company.tbsubscriptions.status,
          nextBillingDate: company.tbsubscriptions.nextBillingDate,
        }
      : null,
  };
}
