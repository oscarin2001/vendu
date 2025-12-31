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

  // Verificar que el supplierNumber no existe
  const existingSupplier = await prisma.tbsuppliers.findUnique({
    where: { supplierNumber: validatedData.supplierNumber },
  });

  if (existingSupplier) {
    throw new Error("Supplier number already exists");
  }

  // Si se especifica un manager, verificar que existe y pertenece a la compañía
  if (validatedData.managerId) {
    const manager = await prisma.tbemployee_profiles.findUnique({
      where: {
        PK_employee: validatedData.managerId,
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
      throw new Error("Manager not found or not authorized");
    }
  }

  const supplier = await prisma.tbsuppliers.create({
    data: {
      supplierNumber: validatedData.supplierNumber,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      email: validatedData.email || null,
      address: validatedData.address,
      city: validatedData.city,
      department: validatedData.department,
      notes: validatedData.notes,
      FK_manager: validatedData.managerId || null,
    },
  });

  return {
    id: supplier.PK_supplier,
    supplierNumber: supplier.supplierNumber,
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

  // Si se especifica un manager, verificar que existe
  if (validatedData.managerId !== undefined) {
    if (validatedData.managerId) {
      const manager = await prisma.tbemployee_profiles.findUnique({
        where: {
          PK_employee: validatedData.managerId,
          auth: {
            privilege: {
              privilegeCode: "BRANCH_MANAGER",
            },
          },
          deletedAt: null,
        },
      });

      if (!manager) {
        throw new Error("Manager not found");
      }
    }
  }

  const supplier = await prisma.tbsuppliers.update({
    where: { PK_supplier: supplierId },
    data: {
      ...(validatedData.supplierNumber && {
        supplierNumber: validatedData.supplierNumber,
      }),
      ...(validatedData.firstName && { firstName: validatedData.firstName }),
      ...(validatedData.lastName && { lastName: validatedData.lastName }),
      ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
      ...(validatedData.email !== undefined && { email: validatedData.email }),
      ...(validatedData.address !== undefined && {
        address: validatedData.address,
      }),
      ...(validatedData.city !== undefined && { city: validatedData.city }),
      ...(validatedData.department !== undefined && {
        department: validatedData.department,
      }),
      ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      ...(validatedData.managerId !== undefined && {
        FK_manager: validatedData.managerId,
      }),
    },
  });

  return {
    id: supplier.PK_supplier,
    supplierNumber: supplier.supplierNumber,
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
