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
          privilegeCode: {
            in: ["MANAGER", "BRANCH_MANAGER"], // Ajustar según los códigos reales
          },
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
      branch: true,
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
    branch: manager.branch
      ? {
          id: manager.branch.PK_branch,
          name: manager.branch.name,
          isWarehouse: manager.branch.isWarehouse,
        }
      : null,
    privilege: {
      name: manager.auth.privilege.privilegeName,
      code: manager.auth.privilege.privilegeCode,
    },
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
  };
}
