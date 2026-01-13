"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyByTenant(
  tenantId: string
): Promise<any | null> {
  const company = (await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    include: {
      tbsubscriptions: true,
      createdBy: {
        select: {
          PK_employee: true,
          firstName: true,
          lastName: true,
          phone: true,
          ci: true,
          birthDate: true,
          birthYear: true,
          joinedAt: true,
          contractEndAt: true,
        },
      },
    },
  })) as any;

  if (!company) {
    return null;
  }

  return {
    id: company.PK_company,
    name: company.name,
    slug: company.slug,
    taxId: company.taxId,
    taxIdPath: company.taxIdPath,
    country: company.country,
    department: company.department,
    commerceType: company.commerceType,
    description: company.description,
    vision: company.vision,
    mission: company.mission,
    businessName: company.businessName,
    fiscalAddress: company.fiscalAddress,
    openedAt: company.openedAt,
    createdAt: company.createdAt,
    owner: company.createdBy
      ? {
          id: company.createdBy.PK_employee,
          firstName: company.createdBy.firstName,
          lastName: company.createdBy.lastName,
          phone: company.createdBy.phone,
          ci: company.createdBy.ci,
          birthDate: company.createdBy.birthDate || undefined,
          birthYear: company.createdBy.birthYear || undefined,
          joinedAt: company.createdBy.joinedAt || undefined,
          contractEndAt: company.createdBy.contractEndAt || undefined,
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
