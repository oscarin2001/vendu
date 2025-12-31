"use server";

import { prisma } from "@/lib/prisma";

export async function getSuppliersByCompany(tenantId: string) {
  const suppliers = await prisma.tbsuppliers.findMany({
    where: {
      manager: {
        company: {
          slug: tenantId,
        },
      },
      deletedAt: null,
    },
    include: {
      manager: {
        include: {
          auth: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return suppliers.map((supplier: any) => ({
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
    country: supplier.country,
    notes: supplier.notes,
    isActive: supplier.isActive,
    manager: supplier.manager
      ? {
          id: supplier.manager.PK_employee,
          name: `${supplier.manager.firstName} ${supplier.manager.lastName}`,
          email: supplier.manager.auth.username,
        }
      : null,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  }));
}

export async function getSupplierById(supplierId: number) {
  const supplier = await prisma.tbsuppliers.findUnique({
    where: { PK_supplier: supplierId },
    include: {
      manager: {
        include: {
          auth: true,
        },
      },
    },
  });

  if (!supplier) return null;

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
    manager: supplier.manager
      ? {
          id: supplier.manager.PK_employee,
          name: `${supplier.manager.firstName} ${supplier.manager.lastName}`,
          email: supplier.manager.auth.username,
        }
      : null,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}
