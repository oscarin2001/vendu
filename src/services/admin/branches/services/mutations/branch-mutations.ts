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
      isWarehouse: validatedData.isWarehouse,
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
    isWarehouse: branch.isWarehouse,
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

  const branch = await prisma.tbbranches.update({
    where: { PK_branch: branchId },
    data: validatedData,
  });

  return {
    id: branch.PK_branch,
    name: branch.name,
    isWarehouse: branch.isWarehouse,
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

  // Verificar que es un manager (puedes ajustar los códigos según tu esquema)
  const isManager = ["MANAGER", "BRANCH_MANAGER"].includes(
    employee.auth.privilege.privilegeCode
  );
  if (!isManager) {
    throw new Error("Employee is not a manager");
  }

  // Asignar el empleado a la sucursal
  await prisma.tbemployee_profiles.update({
    where: { PK_employee: employeeId },
    data: { FK_branch: branchId },
  });

  return { success: true };
}
