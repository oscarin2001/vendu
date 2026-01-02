"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
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
          hireDate: validatedData.hireDate || new Date(),
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

export async function deleteManager(
  managerId: number,
  employeeId?: number,
  companyId?: number
) {
  const auditService = getAuditService(prisma);

  // Obtener el manager antes de eliminarlo para la auditoría
  const manager = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: { auth: true },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Soft delete
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: {
      deletedAt: new Date(),
    },
  });

  // Registrar en auditoría
  await auditService.log({
    entity: "tbemployee_profiles",
    entityId: managerId,
    action: "DELETE",
    oldValue: {
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    newValue: null,
    employeeId,
    companyId,
  });

  return { success: true };
}

export async function toggleManagerStatus(managerId: number, tenantId: string) {
  // Obtener la compañía para validación
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
    select: { PK_company: true },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Obtener el manager actual
  const manager = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
    include: { auth: true },
  });

  if (!manager) {
    throw new Error("Manager not found");
  }

  // Verificar que el manager pertenece a la compañía
  if (manager.FK_company !== company.PK_company) {
    throw new Error("Manager does not belong to this company");
  }

  // Determinar el nuevo estado
  let newStatus: "ACTIVE" | "DEACTIVATED";
  let auditAction: "CREATE" | "UPDATE";

  if (manager.status === "ACTIVE") {
    // De ACTIVE a DEACTIVATED
    newStatus = "DEACTIVATED";
    auditAction = "UPDATE";
  } else if (manager.status === "DEACTIVATED") {
    // De DEACTIVATED a ACTIVE
    newStatus = "ACTIVE";
    auditAction = "CREATE";
  } else {
    // INACTIVE no se puede cambiar con toggle
    throw new Error("No se puede cambiar el estado de un manager inactivo");
  }

  // Actualizar el status en la base de datos
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: managerId },
    data: { status: newStatus },
  });

  // Registrar en auditoría
  const auditService = getAuditService(prisma);
  await auditService.log({
    entity: "tbemployee_profiles",
    entityId: managerId,
    action: auditAction,
    oldValue: {
      status: manager.status,
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    newValue: {
      status: newStatus,
      firstName: manager.firstName,
      lastName: manager.lastName,
      ci: manager.ci,
      email: manager.auth.username,
    },
    employeeId: 1, // TODO: Get from session
    companyId: company.PK_company,
  });

  return { success: true, newStatus };
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
