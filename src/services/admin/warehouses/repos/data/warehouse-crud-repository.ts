"use server";

import { prisma } from "@/lib/prisma";

/**
 * Create a new warehouse
 * @param data - Warehouse creation data
 * @returns Created warehouse
 */
export async function createWarehouse(data: {
  name: string;
  phone?: string;
  address: string;
  city: string;
  department?: string;
  country?: string;
  companyId: number;
  createdBy?: number;
}) {
  return await prisma.tbwarehouses.create({
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      department: data.department,
      country: data.country,
      FK_company: data.companyId,
      FK_createdBy: data.createdBy,
    },
  });
}

/**
 * Update an existing warehouse
 * @param warehouseId - Warehouse ID
 * @param data - Update data
 * @returns Updated warehouse
 */
export async function updateWarehouse(
  warehouseId: number,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    department?: string;
    country?: string;
    updatedBy?: number;
    openedAt?: Date | string | null;
  },
) {
  const updateData: any = {
    ...data,
  };

  if (data.updatedBy !== undefined) {
    updateData.FK_updatedBy = data.updatedBy;
  }

  // Map openedAt explicitly if provided
  if (data.openedAt !== undefined) {
    updateData.openedAt = data.openedAt;
  }

  delete updateData.updatedBy;

  return await prisma.tbwarehouses.update({
    where: { PK_warehouse: warehouseId },
    data: updateData,
  });
}

/**
 * Delete a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Deleted warehouse
 */
export async function deleteWarehouse(warehouseId: number) {
  return await prisma.tbwarehouses.delete({
    where: { PK_warehouse: warehouseId },
  });
}
