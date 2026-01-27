"use server";

import { prisma } from "@/lib/prisma";
import { getAuditService } from "@/services/shared/audit";
import { validateAdminPassword } from "@/services/admin/managers";
import { UpdateManagerData } from "../../../validations/types/inferred.types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update an existing manager
 * @param tenantId - The company slug/tenant identifier
 * @param managerId - The manager ID to update
 * @param data - Manager update data
 * @param context - User context for auditing
 * @returns Updated manager information
 */
export async function updateManager(
  tenantId: string,
  managerId: number,
  data: UpdateManagerData,
  context?: UserContext,
) {
  const maybeData: any = { ...(data as any) };
  // extract and remove confirm password and change reason if provided
  const confirmPassword: string | undefined = maybeData._confirmPassword;
  if (maybeData._confirmPassword) delete maybeData._confirmPassword;
  const changeReason: string | undefined = maybeData._changeReason;
  if (maybeData._changeReason) delete maybeData._changeReason;
  if (confirmPassword) {
    try {
      await validateAdminPassword({
        tenantId,
        employeeId: context?.employeeId,
        password: confirmPassword,
      });
    } catch (err: any) {
      const e = new Error(err?.message || "La contraseña no coincide");
      e.name = "ValidationError";
      throw e;
    }
  }
  // fetch old values for audit
  const oldEmployee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: managerId },
  });

  const oldAuth = oldEmployee
    ? await prisma.tbauth.findUnique({
        where: { PK_auth: oldEmployee.FK_auth },
        select: { username: true },
      })
    : null;

  const oldManagerBranches = await prisma.tbmanager_branches.findMany({
    where: { FK_manager: managerId },
    select: { FK_branch: true },
  });
  // Separar los campos que van a diferentes tablas
  const {
    branchIds,
    email,
    password,
    contributionType,
    isIndefinite,
    ...restEmployeeData
  } = data;

  // Verificar que la cédula de identidad no existe en otro empleado si se está actualizando
  if (restEmployeeData.ci !== undefined) {
    const existingEmployee = await prisma.tbemployee_profiles.findFirst({
      where: {
        ci: restEmployeeData.ci,
        PK_employee: { not: managerId }, // Excluir el empleado actual
      },
    });

    if (existingEmployee) {
      throw new Error(
        "La cédula de identidad ya está registrada por otro empleado",
      );
    }
  }

  // Manejar contractEndAt basado en isIndefinite
  const contractData: Record<string, any> = {};
  if (isIndefinite !== undefined) {
    if (isIndefinite) {
      contractData.contractEndAt = null;
      contractData.contractType = "INDEFINIDO";
    } else if (restEmployeeData.contractEndAt !== undefined) {
      contractData.contractEndAt = restEmployeeData.contractEndAt;
      contractData.contractType = "TEMPORAL";
    }
    // Remover contractEndAt de restEmployeeData si ya lo manejamos
    delete restEmployeeData.contractEndAt;
  }

  // Transformar contributionType a mayúsculas para coincidir con el enum de Prisma
  const employeeData = {
    ...restEmployeeData,
    ...contractData,
    ...(contributionType && {
      contributionType: contributionType.toUpperCase() as
        | "NONE"
        | "CONTRIBUTES"
        | "PAID",
    }),
    // Agregar quién actualizó el registro
    ...(context?.employeeId && { FK_updatedBy: context.employeeId }),
  };

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

  // Actualizar el password en tbauth si se proporcionó
  if (password !== undefined && password.trim() !== "") {
    await prisma.tbauth.update({
      where: { PK_auth: employee.FK_auth },
      data: { password: password },
    });
  }

  // Manejar la asignación/desasignación de sucursales
  if (branchIds !== undefined) {
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

    // Sucursales a desasignar (están en current pero no en branchIds)
    const branchesToUnassign = currentBranchIds.filter(
      (id) => !branchIds.includes(id),
    );

    // Sucursales a asignar (están en branchIds pero no en current)
    const branchesToAssign = branchIds.filter(
      (id) => !currentBranchIds.includes(id),
    );

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

  // Audit log: include change reason if provided
  try {
    const auditService = getAuditService(prisma);
    const oldValue = {
      firstName: oldEmployee?.firstName,
      lastName: oldEmployee?.lastName,
      ci: oldEmployee?.ci,
      phone: oldEmployee?.phone,
      salary: oldEmployee?.salary,
      email: oldAuth?.username,
      branchIds: oldManagerBranches.map((b) => b.FK_branch),
    };

    const finalManagerBranches = await prisma.tbmanager_branches.findMany({
      where: { FK_manager: managerId },
      select: { FK_branch: true },
    });

    const newValue: Record<string, any> = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      ci: employee.ci,
      phone: employee.phone,
      salary: employee.salary,
      email: updatedAuth?.username,
      branchIds: finalManagerBranches.map((b) => b.FK_branch),
    };

    if (changeReason) {
      newValue._changeReason = changeReason;
      newValue._changedAt = new Date().toISOString();
    }

    await auditService.logUpdate("MANAGER", managerId, oldValue, newValue, {
      employeeId: context?.employeeId,
      companyId: context?.companyId,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });
  } catch (err) {
    // audit failures should not block main operation
    console.error("Manager audit log error:", err);
  }

  return {
    id: employee.PK_employee,
    firstName: employee.firstName,
    lastName: employee.lastName,
    ci: employee.ci,
    phone: employee.phone,
    salary: Number(employee.salary),
    email: updatedAuth?.username,
    branchIds: branchIds || [],
  };
}
