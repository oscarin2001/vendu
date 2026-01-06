import { prisma } from "@/lib/prisma";

export async function getManagerByIdWithValidation(
  managerId: number,
  tenantId: string
) {
  return await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: managerId,
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
      },
      deletedAt: null,
    },
  });
}
