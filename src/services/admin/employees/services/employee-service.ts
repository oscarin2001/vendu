"use server";

import { prisma } from "@/lib/prisma";

export async function getEmployeesByCompany(tenantId: string) {
  const employees = await prisma.tbemployee_profiles.findMany({
    where: {
      company: {
        slug: tenantId,
      },
      auth: {
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

  return employees.map((employee: any) => ({
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
  }));
}

export async function getEmployeeById(employeeId: number) {
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: employeeId },
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
