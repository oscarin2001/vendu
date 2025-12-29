"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  taxId: z.string().optional(),
  country: z.string().optional(),
});

type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

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

export async function updateCompany(tenantId: string, data: UpdateCompanyData) {
  const validatedData = updateCompanySchema.parse(data);

  const company = await prisma.tbcompanies.update({
    where: { slug: tenantId },
    data: {
      name: validatedData.name,
      taxId: validatedData.taxId,
      country: validatedData.country,
    },
  });

  return {
    id: company.PK_company,
    name: company.name,
    slug: company.slug,
    taxId: company.taxId,
    country: company.country,
  };
}

export async function getCompanySubscription(tenantId: string) {
  const subscription = await prisma.tbsubscriptions.findFirst({
    where: {
      company: {
        slug: tenantId,
      },
    },
  });

  if (!subscription) {
    return null;
  }

  return {
    planType: subscription.planType,
    status: subscription.status,
    nextBillingDate: subscription.nextBillingDate,
  };
}
