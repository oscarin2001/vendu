"use server";

import { prisma } from "@/lib/prisma";
import {
  CreateBranchData,
  UpdateBranchData,
  createBranchSchema,
  updateBranchSchema,
} from "../../validators/branch-validation";

export async function createBranch(tenantId: string, data: CreateBranchData) {
  const validatedData = createBranchSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const branch = await prisma.tbbranches.create({
    data: {
      FK_company: company.PK_company,
      name: validatedData.name,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      department: validatedData.department,
      country: validatedData.country,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
    },
  });

  return {
    id: branch.PK_branch,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
    createdAt: branch.createdAt,
  };
}

export async function updateBranch(branchId: number, data: UpdateBranchData) {
  const validatedData = updateBranchSchema.parse(data);

  // Extraer managerIds y supplierIds del validatedData para manejarlo por separado
  const { managerIds = [], supplierIds = [], ...branchData } = validatedData;

  console.log("updateBranch called with:", {
    branchId,
    managerIds,
    supplierIds,
    branchData,
  });

  // Actualizar los datos básicos de la sucursal
  const branch = await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data: branchData,
  });

  // Manejar la asignación/desasignación de managers
  console.log(
    "Actualizando managers para sucursal:",
    branchId,
    "nuevos managers:",
    managerIds
  );

  // Obtener managers actualmente asignados a esta sucursal
  const currentManagers = await prisma.tbmanager_branches.findMany({
    where: {
      FK_branch: branchId,
    },
    include: {
      manager: {
        include: {
          auth: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  const currentManagerIds = currentManagers
    .filter(
      (mb) => mb.manager.auth.privilege.privilegeCode === "BRANCH_MANAGER"
    )
    .map((mb) => mb.manager.PK_employee);
  console.log("Managers actuales:", currentManagerIds);

  // Managers a desasignar (están en current pero no en managerIds)
  const managersToUnassign = currentManagerIds.filter(
    (id) => !managerIds.includes(id)
  );
  console.log("Managers a desasignar:", managersToUnassign);

  // Managers a asignar (están en managerIds pero no en current)
  const managersToAssign = managerIds.filter(
    (id) => !currentManagerIds.includes(id)
  );
  console.log("Managers a asignar:", managersToAssign);

  // Desasignar managers que ya no están en la lista
  for (const managerId of managersToUnassign) {
    console.log("Desasignando manager:", managerId, "de sucursal:", branchId);
    await unassignManagerFromBranch(managerId, branchId);
  }

  // Asignar managers nuevos
  for (const managerId of managersToAssign) {
    console.log("Asignando manager:", managerId);
    await assignManagerToBranch(branchId, managerId);
  }

  // Manejar la asignación/desasignación de proveedores
  console.log(
    "Actualizando proveedores para sucursal:",
    branchId,
    "nuevos proveedores:",
    supplierIds
  );

  // Obtener proveedores actualmente asignados a esta sucursal
  const currentSupplierAssignments = await prisma.tbsupplier_branches.findMany({
    where: { FK_branch: branchId },
    select: { FK_supplier: true },
  });

  const currentSupplierIds = currentSupplierAssignments.map(
    (sa) => sa.FK_supplier
  );
  console.log("Proveedores actuales:", currentSupplierIds);

  // Proveedores a desasignar (están en current pero no en supplierIds)
  const suppliersToUnassign = currentSupplierIds.filter(
    (id) => !supplierIds.includes(id)
  );
  console.log("Proveedores a desasignar:", suppliersToUnassign);

  // Proveedores a asignar (están en supplierIds pero no en current)
  const suppliersToAssign = supplierIds.filter(
    (id) => !currentSupplierIds.includes(id)
  );
  console.log("Proveedores a asignar:", suppliersToAssign);

  // Desasignar proveedores que ya no están en la lista
  if (suppliersToUnassign.length > 0) {
    await prisma.tbsupplier_branches.deleteMany({
      where: {
        FK_branch: branchId,
        FK_supplier: {
          in: suppliersToUnassign,
        },
      },
    });
  }

  // Asignar proveedores nuevos
  if (suppliersToAssign.length > 0) {
    const supplierAssignments = suppliersToAssign.map((supplierId) => ({
      FK_supplier: supplierId,
      FK_branch: branchId,
    }));

    await prisma.tbsupplier_branches.createMany({
      data: supplierAssignments,
    });
  }

  return {
    id: branch.PK_branch,
    name: branch.name,
    phone: branch.phone,
    address: branch.address,
    city: branch.city,
    department: branch.department,
    country: branch.country,
    latitude: branch.latitude,
    longitude: branch.longitude,
  };
}

export async function deleteBranch(branchId: number) {
  // Verificar que no haya empleados activos en la sucursal
  const employeesCount = await prisma.tbemployee_profiles.count({
    where: {
      FK_branch: branchId,
      deletedAt: null,
    },
  });

  if (employeesCount > 0) {
    throw new Error("Cannot delete branch with active employees");
  }

  await prisma.tbbranches.delete({
    where: { PK_branch: branchId },
  });

  return { success: true };
}

export async function assignManagerToBranch(
  branchId: number,
  employeeId: number
) {
  // Verificar que el empleado existe y es un manager
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: employeeId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Verificar que es un manager
  const isManager = employee.auth.privilege.privilegeCode === "BRANCH_MANAGER";
  if (!isManager) {
    throw new Error("Employee is not a manager");
  }

  // Verificar que no esté ya asignado
  const existingAssignment = await prisma.tbmanager_branches.findUnique({
    where: {
      FK_manager_FK_branch: {
        FK_manager: employeeId,
        FK_branch: branchId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("Manager is already assigned to this branch");
  }

  // Asignar el manager a la sucursal usando la tabla intermedia
  await prisma.tbmanager_branches.create({
    data: {
      FK_manager: employeeId,
      FK_branch: branchId,
    },
  });

  return { success: true };
}

export async function unassignManagerFromBranch(
  employeeId: number,
  branchId: number
) {
  // Verificar que el empleado existe y es un manager
  const employee = await prisma.tbemployee_profiles.findUnique({
    where: { PK_employee: employeeId },
    include: {
      auth: {
        include: {
          privilege: true,
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Verificar que es un manager
  const isManager = employee.auth.privilege.privilegeCode === "BRANCH_MANAGER";
  if (!isManager) {
    throw new Error("Employee is not a manager");
  }

  // Eliminar la asignación de la tabla intermedia
  await prisma.tbmanager_branches.deleteMany({
    where: {
      FK_manager: employeeId,
      FK_branch: branchId,
    },
  });

  return { success: true };
}
