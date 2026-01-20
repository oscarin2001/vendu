"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { CreateManagerData } from "../../../validations/types/inferred.types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new manager for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @param data - Manager creation data
 * @param context - User context for auditing
 * @returns Created manager information
 */
export async function createManager(
  tenantId: string,
  data: CreateManagerData,
  context?: UserContext,
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verificar que el email no existe
  const existingUser = await prisma.tbauth.findUnique({
    where: { username: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Verificar que la cédula de identidad no existe
  const existingEmployee = await prisma.tbemployee_profiles.findUnique({
    where: { ci: data.ci },
  });

  if (existingEmployee) {
    throw new Error("La cédula de identidad ya está registrada");
  }

  // Obtener o crear el privilegio de manager
  const managerPrivilege = await prisma.tbprivileges.upsert({
    where: {
      privilegeCode: "BRANCH_MANAGER",
    },
    update: {},
    create: {
      privilegeName: "Branch Manager",
      privilegeCode: "BRANCH_MANAGER",
      description: "Encargado de sucursal con permisos administrativos",
    },
  });

  // Crear usuario y empleado en una transacción
  const result = await prisma.$transaction(
    async (
      tx: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
    ) => {
      const auth = await tx.tbauth.create({
        data: {
          FK_company: company.PK_company,
          FK_privilege: managerPrivilege.PK_privilege,
          username: data.email,
          password: data.password, // En producción, hashear la contraseña
          accountType: "EMPLOYEE",
        },
      });

      const employee = await tx.tbemployee_profiles.create({
        data: {
          FK_auth: auth.PK_auth,
          FK_company: company.PK_company,
          firstName: data.firstName,
          lastName: data.lastName,
          ci: data.ci,
          phone: data.phone,
          salary: data.salary,
          hireDate: data.hireDate || new Date(),
        },
      });

      // Crear las asignaciones de sucursales
      if (data.branchIds && data.branchIds.length > 0) {
        const managerBranchData = data.branchIds.map((branchId) => ({
          FK_manager: employee.PK_employee,
          FK_branch: branchId,
        }));

        await tx.tbmanager_branches.createMany({
          data: managerBranchData,
        });
      }

      return { auth, employee };
    },
  );

  return {
    id: result.employee.PK_employee,
    firstName: result.employee.firstName,
    lastName: result.employee.lastName,
    email: result.auth.username,
    branchIds: data.branchIds || [],
  };
}
