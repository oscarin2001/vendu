import { prisma } from "@/lib/prisma";

export async function getCompanyById(companyId: number) {
  return await prisma.tbcompanies.findUnique({
    where: { PK_company: companyId },
    include: {
      tbsubscriptions: true,
      branches: {
        include: {
          tbemployee_profiles: {
            include: {
              auth: {
                include: {
                  privilege: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getCompanyBySlug(slug: string) {
  return await prisma.tbcompanies.findUnique({
    where: { slug },
    include: {
      tbsubscriptions: true,
      branches: {
        include: {
          tbemployee_profiles: {
            include: {
              auth: {
                include: {
                  privilege: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

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
