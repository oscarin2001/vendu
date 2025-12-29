"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import {
  CreateManagerData,
  UpdateManagerData,
  createManagerSchema,
  updateManagerSchema,
} from "../../validators/manager-validation";

export async function createManager(tenantId: string, data: CreateManagerData) {
  const validatedData = createManagerSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verificar que el email no existe
  const existingUser = await prisma.tbauth.findUnique({
    where: { username: validatedData.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
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
      >
    ) => {
      const auth = await tx.tbauth.create({
        data: {
          FK_company: company.PK_company,
          FK_privilege: managerPrivilege.PK_privilege,
          username: validatedData.email,
          password: validatedData.password, // En producción, hashear la contraseña
          accountType: "EMPLOYEE",
        },
      });

      const employee = await tx.tbemployee_profiles.create({
        data: {
          FK_auth: auth.PK_auth,
          FK_company: company.PK_company,
          FK_branch: validatedData.branchId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          ci: validatedData.ci,
          phone: validatedData.phone,
          salary: validatedData.salary,
        },
      });

      return { auth, employee };
    }
  );

  return {
    id: result.employee.PK_employee,
    firstName: result.employee.firstName,
    lastName: result.employee.lastName,
    email: result.auth.username,
    branchId: result.employee.FK_branch,
  };
}

export async function updateManager(
  managerId: number,
  data: UpdateManagerData
) {
  const validatedData = updateManagerSchema.parse(data);

  const employee = await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      ci: validatedData.ci,
      phone: validatedData.phone,
      salary: validatedData.salary,
      FK_branch: validatedData.branchId,
    },
  });

  return {
    id: employee.PK_employee,
    firstName: employee.firstName,
    lastName: employee.lastName,
    ci: employee.ci,
    phone: employee.phone,
    salary: employee.salary,
    branchId: employee.FK_branch,
  };
}

export async function deleteManager(managerId: number) {
  // Soft delete
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: {
      deletedAt: new Date(),
    },
  });

  return { success: true };
}
