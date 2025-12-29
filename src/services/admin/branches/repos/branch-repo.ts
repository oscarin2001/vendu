import { prisma } from "@/lib/prisma";

export async function getBranchesByCompanyId(companyId: number) {
  return await prisma.tbbranches.findMany({
    where: { FK_company: companyId },
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
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getBranchById(branchId: number) {
  return await prisma.tbbranches.findUnique({
    where: { PK_branch: branchId },
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
      company: true,
    },
  });
}

export async function createBranch(data: {
  FK_company: number;
  name: string;
  isWarehouse?: boolean;
  phone?: string;
  address: string;
  city: string;
  department?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}) {
  return await prisma.tbbranches.create({
    data,
  });
}

export async function updateBranch(
  branchId: number,
  data: {
    name?: string;
    isWarehouse?: boolean;
    phone?: string;
    address?: string;
    city?: string;
    department?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  return await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data,
  });
}

export async function deleteBranch(branchId: number) {
  return await prisma.tbbranches.delete({
    where: { PK_branch: branchId },
  });
}
