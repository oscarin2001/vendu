"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";

export async function getManagersByCompany(tenantId: string) {
  // Obtener la compañía para tener el ID
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    select: { PK_company: true },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const managers = await prisma.tbemployee_profiles.findMany({
    where: {
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
      },
      // Removido: deletedAt: null - ahora el estado se determina por auditoría
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

  // Mapear managers con el nuevo campo status
  const managersWithStatus = managers.map((manager: any) => {
    // Calcular isActive basado en status: ACTIVE = true, otros = false
    const isActive = manager.status === "ACTIVE";

    // Determinar estado de conexión basado en estado laboral
    let connectionStatus: "ONLINE" | "OFFLINE" | "AWAY" | "UNKNOWN" = "UNKNOWN";
    if (manager.status === "INACTIVE") {
      connectionStatus = "UNKNOWN"; // No aplica para inactivos
    } else if (manager.status === "DEACTIVATED") {
      connectionStatus = "OFFLINE"; // No puede acceder
    } else if (manager.status === "ACTIVE") {
      connectionStatus = "UNKNOWN"; // Estado desconocido por defecto
    }

    return {
      id: manager.PK_employee,
      firstName: manager.firstName,
      lastName: manager.lastName,
      fullName: `${manager.firstName} ${manager.lastName}`,
      ci: manager.ci,
      phone: manager.phone,
      email: manager.auth.username,
      salary: manager.salary ? manager.salary.toNumber() : 0,
      hireDate: manager.hireDate,
      status: manager.status, // Nuevo campo
      connectionStatus, // Nuevo campo
      contributionType: (manager.salary === null ||
      manager.salary === undefined ||
      manager.salary.toNumber() === 0
        ? "none"
        : "paid") as "none" | "contributes" | "paid", // Determinar basado en salary
      branches: manager.managerBranches.map((mb: any) => ({
        id: mb.branch.PK_branch,
        name: mb.branch.name,
      })),
      privilege: {
        name: manager.auth.privilege.privilegeName,
        code: manager.auth.privilegeCode,
      },
      isActive,
      createdAt: manager.hireDate, // Usando hireDate como aproximación
      contractType: manager.contractType,
    };
  });

  return managersWithStatus;
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

  // Calcular isActive basado en status
  const isActive = employee.status === "ACTIVE";

  // Determinar estado de conexión basado en estado laboral
  let connectionStatus: "ONLINE" | "OFFLINE" | "AWAY" | "UNKNOWN" = "UNKNOWN";
  if (employee.status === "INACTIVE") {
    connectionStatus = "UNKNOWN"; // No aplica para inactivos
  } else if (employee.status === "DEACTIVATED") {
    connectionStatus = "OFFLINE"; // No puede acceder
  } else if (employee.status === "ACTIVE") {
    connectionStatus = "UNKNOWN"; // Estado desconocido por defecto
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
    status: employee.status, // Nuevo campo
    connectionStatus, // Nuevo campo
    contributionType: (employee.salary === null ||
    employee.salary === undefined ||
    employee.salary.toNumber() === 0
      ? "none"
      : "paid") as "none" | "contributes" | "paid", // Determinar basado en salary
    contractType: employee.contractType,
    branch: employee.branch
      ? {
          id: employee.branch.PK_branch,
          name: employee.branch.name,
        }
      : null,
    privilege: {
      name: employee.auth.privilege.privilegeName,
      code: employee.auth.privilege.privilegeCode,
    },
    isActive,
    createdAt: employee.auth.createdAt,
  };
}
