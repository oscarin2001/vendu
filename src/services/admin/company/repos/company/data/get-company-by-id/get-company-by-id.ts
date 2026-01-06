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
