"use server";

import { prisma } from "@/lib/prisma";

export async function getManagersByCompany(tenantId: string) {
  const managers = await prisma.tbemployee_profiles.findMany({
    where: {
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
        isActive: true,
      },
      deletedAt: null,
    },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
      managerBranches: {
        include: {
          branch: true,
        },
      },
    },
    orderBy: {
      hireDate: "desc",
    },
  });

  return managers.map((manager: any) => ({
    id: manager.PK_employee,
    firstName: manager.firstName,
    lastName: manager.lastName,
    fullName: `${manager.firstName} ${manager.lastName}`,
    ci: manager.ci,
    phone: manager.phone,
    email: manager.auth.username,
    salary: manager.salary ? manager.salary.toNumber() : 0,
    hireDate: manager.hireDate,
    branches: manager.managerBranches.map((mb: any) => ({
      id: mb.branch.PK_branch,
      name: mb.branch.name,
      isWarehouse: mb.branch.isWarehouse,
    })),
    privilege: {
      name: manager.auth.privilege.privilegeName,
      code: manager.auth.privilege.privilegeCode,
    },
    isActive: manager.auth.isActive,
    createdAt: manager.hireDate, // Usando hireDate como aproximación
    contractType: manager.contractType,
  }));
}

export async function getManagerById(managerId: number) {
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
      branch: true,
      company: true,
    },
  });

  if (!employee) {
    return null;
  }

  return {
    id: employee.PK_employee,
    firstName: employee.firstName,
    lastName: employee.lastName,
    fullName: `${employee.firstName} ${employee.lastName}`,
    ci: employee.ci,
    phone: employee.phone,
    email: employee.auth.username,
    salary: employee.salary ? employee.salary.toNumber() : 0,
    hireDate: employee.hireDate,
    contractType: employee.contractType,
    branch: employee.branch
      ? {
          id: employee.branch.PK_branch,
          name: employee.branch.name,
          isWarehouse: employee.branch.isWarehouse,
        }
      : null,
    privilege: {
      name: employee.auth.privilege.privilegeName,
      code: employee.auth.privilege.privilegeCode,
    },
    isActive: employee.auth.isActive,
    createdAt: employee.auth.createdAt,
  };
}
