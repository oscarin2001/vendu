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
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          ci: validatedData.ci,
          phone: validatedData.phone,
          salary: validatedData.salary,
        },
      });

      // Crear las asignaciones de sucursales
      if (validatedData.branchIds && validatedData.branchIds.length > 0) {
        const managerBranchData = validatedData.branchIds.map((branchId) => ({
          FK_manager: employee.PK_employee,
          FK_branch: branchId,
        }));

        await tx.tbmanager_branches.createMany({
          data: managerBranchData,
        });
      }

      return { auth, employee };
    }
  );

  return {
    id: result.employee.PK_employee,
    firstName: result.employee.firstName,
    lastName: result.employee.lastName,
    email: result.auth.username,
    branchIds: validatedData.branchIds || [],
  };
}

export async function updateManager(
  managerId: number,
  data: UpdateManagerData
) {
  const validatedData = updateManagerSchema.parse(data);

  // Separar los campos que van a diferentes tablas
  const { branchIds, email, ...employeeData } = validatedData;

  // Actualizar los datos básicos del empleado
  const employee = await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: employeeData,
  });

  // Actualizar el email en tbauth si se proporcionó
  if (email !== undefined) {
    await prisma.tbauth.update({
      where: { PK_auth: employee.FK_auth },
      data: { username: email },
    });
  }

  // Manejar la asignación/desasignación de sucursales
  if (branchIds !== undefined) {
    console.log(
      "Actualizando sucursales para manager:",
      managerId,
      "nuevas sucursales:",
      branchIds
    );

    // Obtener sucursales actualmente asignadas a este manager
    const currentManagerBranches = await prisma.tbmanager_branches.findMany({
      where: {
        FK_manager: managerId,
      },
      select: {
        FK_branch: true,
      },
    });

    const currentBranchIds = currentManagerBranches.map((mb) => mb.FK_branch);
    console.log("Sucursales actuales:", currentBranchIds);

    // Sucursales a desasignar (están en current pero no en branchIds)
    const branchesToUnassign = currentBranchIds.filter(
      (id) => !branchIds.includes(id)
    );
    console.log("Sucursales a desasignar:", branchesToUnassign);

    // Sucursales a asignar (están en branchIds pero no en current)
    const branchesToAssign = branchIds.filter(
      (id) => !currentBranchIds.includes(id)
    );
    console.log("Sucursales a asignar:", branchesToAssign);

    // Desasignar sucursales que ya no están en la lista
    if (branchesToUnassign.length > 0) {
      await prisma.tbmanager_branches.deleteMany({
        where: {
          FK_manager: managerId,
          FK_branch: {
            in: branchesToUnassign,
          },
        },
      });
    }

    // Asignar sucursales nuevas
    if (branchesToAssign.length > 0) {
      const managerBranchData = branchesToAssign.map((branchId) => ({
        FK_manager: managerId,
        FK_branch: branchId,
      }));

      await prisma.tbmanager_branches.createMany({
        data: managerBranchData,
      });
    }
  }

  // Obtener el email actualizado del auth
  const updatedAuth = await prisma.tbauth.findUnique({
    where: { PK_auth: employee.FK_auth },
    select: { username: true },
  });

  return {
    id: employee.PK_employee,
    firstName: employee.firstName,
    lastName: employee.lastName,
    ci: employee.ci,
    phone: employee.phone,
    salary: employee.salary,
    email: updatedAuth?.username,
    branchIds: branchIds || [],
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

export async function validateAdminPassword(
  tenantId: string,
  adminEmail: string,
  password: string
) {
  // TODO: Implementar validación de contraseña del administrador
  // Por ahora, solo validamos que se proporcione una contraseña
  if (!password || password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  // En una implementación completa, aquí validaríamos contra el usuario autenticado
  // o contra un usuario administrador de la compañía

  return { success: true };
}
