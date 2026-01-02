"use server";

import { prisma } from "@/lib/prisma";
import {
  CreateSupplierData,
  UpdateSupplierData,
  createSupplierSchema,
  updateSupplierSchema,
} from "../../validators/supplier-validation";

export async function createSupplier(
  tenantId: string,
  data: CreateSupplierData
) {
  const validatedData = createSupplierSchema.parse(data);

  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const supplier = await prisma.tbsuppliers.create({
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      email: validatedData.email || null,
      address: validatedData.address,
      city: validatedData.city,
      department: validatedData.department,
      notes: validatedData.notes,
    },
  });

  return {
    id: supplier.PK_supplier,
    firstName: supplier.firstName,
    lastName: supplier.lastName,
    fullName: `${supplier.firstName} ${supplier.lastName}`,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    city: supplier.city,
    department: supplier.department,
    notes: supplier.notes,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
  };
}

export async function updateSupplier(
  supplierId: number,
  data: UpdateSupplierData
) {
  const validatedData = updateSupplierSchema.parse(data);

  const supplier = await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data: {
      ...(validatedData.firstName && { firstName: validatedData.firstName }),
      ...(validatedData.lastName && { lastName: validatedData.lastName }),
      ...(validatedData.phone !== undefined && {
        phone: validatedData.phone,
      }),
      ...(validatedData.email !== undefined && {
        email: validatedData.email,
      }),
      ...(validatedData.address !== undefined && {
        address: validatedData.address,
      }),
      ...(validatedData.city !== undefined && { city: validatedData.city }),
      ...(validatedData.department !== undefined && {
        department: validatedData.department,
      }),
      ...(validatedData.notes !== undefined && {
        notes: validatedData.notes,
      }),
    },
  });

  return {
    id: supplier.PK_supplier,
    firstName: supplier.firstName,
    lastName: supplier.lastName,
    fullName: `${supplier.firstName} ${supplier.lastName}`,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    city: supplier.city,
    department: supplier.department,
    notes: supplier.notes,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}

export async function deleteSupplier(supplierId: number) {
  // Soft delete
  await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data: {
      deletedAt: new Date(),
    },
  });

  return { success: true };
}

export async function assignManagerToSupplier(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Verificar que el supplier existe y pertenece a la compañía
  const supplier = await prisma.tbsuppliers.findFirst({
    where: {
      PK_supplier: supplierId,
      deletedAt: null,
    },
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  // Verificar que el manager existe, pertenece a la compañía y tiene el rol correcto
  const manager = await prisma.tbemployee_profiles.findFirst({
    where: {
      PK_employee: managerId,
      company: {
        slug: tenantId,
      },
      auth: {
        privilege: {
          privilegeCode: "BRANCH_MANAGER",
        },
      },
      deletedAt: null,
    },
  });

  if (!manager) {
    throw new Error("Manager not found or does not have the required role");
  }

  // Verificar que la asignación no existe ya
  const existing = await prisma.tbsupplier_managers.findFirst({
    where: {
      FK_supplier: supplierId,
      FK_manager: managerId,
    },
  });

  if (existing) {
    throw new Error("Manager is already assigned to this supplier");
  }

  const assignment = await prisma.tbsupplier_managers.create({
    data: {
      FK_supplier: supplierId,
      FK_manager: managerId,
    },
  });

  return {
    id: assignment.PK_supplier_manager,
    supplierId: assignment.FK_supplier,
    managerId: assignment.FK_manager,
    assignedAt: assignment.assignedAt,
  };
}

export async function removeManagerFromSupplier(
  tenantId: string,
  supplierId: number,
  managerId: number
) {
  const company = await prisma.tbcompanies.findUnique({
    where: { slug: tenantId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const assignment = await prisma.tbsupplier_managers.findFirst({
    where: {
      FK_supplier: supplierId,
      FK_manager: managerId,
      supplier: {
        deletedAt: null,
      },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await prisma.tbsupplier_managers.delete({
    where: { PK_supplier_manager: assignment.PK_supplier_manager },
  });

  return { success: true };
}
