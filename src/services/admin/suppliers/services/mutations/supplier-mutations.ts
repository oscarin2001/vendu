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

  // Si se especifican managers, verificar que existen y pertenecen a la compañía
  if (validatedData.managerIds && validatedData.managerIds.length > 0) {
    const managers = await prisma.tbemployee_profiles.findMany({
      where: {
        PK_employee: {
          in: validatedData.managerIds,
        },
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

    if (managers.length !== validatedData.managerIds.length) {
      throw new Error("One or more managers not found or not authorized");
    }
  }

  // Crear proveedor y asignaciones de managers en una transacción
  const result = await prisma.$transaction(async (tx) => {
    const supplier = await tx.tbsuppliers.create({
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
      },
    });

    // Crear asignaciones de managers si se especificaron
    if (validatedData.managerIds && validatedData.managerIds.length > 0) {
      const managerAssignments = validatedData.managerIds.map((managerId) => ({
        FK_supplier: supplier.PK_supplier,
        FK_manager: managerId,
      }));

      await tx.tbsupplier_managers.createMany({
        data: managerAssignments,
      });
    }

    return supplier;
  });

  return {
    id: result.PK_supplier,
    supplierNumber: result.supplierNumber,
    firstName: result.firstName,
    lastName: result.lastName,
    fullName: `${result.firstName} ${result.lastName}`,
    phone: result.phone,
    email: result.email,
    address: result.address,
    city: result.city,
    department: result.department,
    notes: result.notes,
    isActive: result.isActive,
    createdAt: result.createdAt,
  };
}

export async function updateSupplier(
  supplierId: number,
  data: UpdateSupplierData
) {
  const validatedData = updateSupplierSchema.parse(data);

  // Si se especifican managers, verificar que existen
  if (validatedData.managerIds !== undefined) {
    if (validatedData.managerIds.length > 0) {
      const managers = await prisma.tbemployee_profiles.findMany({
        where: {
          PK_employee: {
            in: validatedData.managerIds,
          },
          auth: {
            privilege: {
              privilegeCode: "BRANCH_MANAGER",
            },
          },
          deletedAt: null,
        },
      });

      if (managers.length !== validatedData.managerIds.length) {
        throw new Error("One or more managers not found");
      }
    }
  }

  // Actualizar proveedor y asignaciones de managers en una transacción
  const result = await prisma.$transaction(async (tx) => {
    const supplier = await tx.tbsuppliers.update({
      where: { PK_supplier: supplierId },
      data: {
        ...(validatedData.supplierNumber && {
          supplierNumber: validatedData.supplierNumber,
        }),
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

    // Manejar asignaciones de managers si se especificaron
    if (validatedData.managerIds !== undefined) {
      // Obtener asignaciones actuales
      const currentAssignments = await tx.tbsupplier_managers.findMany({
        where: { FK_supplier: supplierId },
        select: { FK_manager: true },
      });

      const currentManagerIds = currentAssignments.map((a) => a.FK_manager);

      // Managers a desasignar (están en current pero no en managerIds)
      const managersToUnassign = currentManagerIds.filter(
        (id) => !validatedData.managerIds!.includes(id)
      );

      // Managers a asignar (están en managerIds pero no en current)
      const managersToAssign = validatedData.managerIds!.filter(
        (id) => !currentManagerIds.includes(id)
      );

      // Desasignar managers que ya no están en la lista
      if (managersToUnassign.length > 0) {
        await tx.tbsupplier_managers.deleteMany({
          where: {
            FK_supplier: supplierId,
            FK_manager: {
              in: managersToUnassign,
            },
          },
        });
      }

      // Asignar managers nuevos
      if (managersToAssign.length > 0) {
        const managerAssignments = managersToAssign.map((managerId) => ({
          FK_supplier: supplierId,
          FK_manager: managerId,
        }));

        await tx.tbsupplier_managers.createMany({
          data: managerAssignments,
        });
      }
    }

    return supplier;
  });

  return {
    id: result.PK_supplier,
    supplierNumber: result.supplierNumber,
    firstName: result.firstName,
    lastName: result.lastName,
    fullName: `${result.firstName} ${result.lastName}`,
    phone: result.phone,
    email: result.email,
    address: result.address,
    city: result.city,
    department: result.department,
    notes: result.notes,
    isActive: result.isActive,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
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
