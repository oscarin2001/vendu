"use server";

import { updateSupplier } from "../../../repos/suppliers";
import { updateSupplierSchema } from "../../../validations/schemas/supplier-schemas";

/**
 * Update an existing supplier
 * @param supplierId - The supplier ID to update
 * @param data - Supplier update data
 * @returns Updated supplier information
 * @throws Error if validation fails or supplier not found
 */
export async function updateSupplierService(supplierId: number, data: any) {
  const validatedData = updateSupplierSchema.parse(data);

  const supplier = await updateSupplier(supplierId, {
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
    ...(validatedData.country !== undefined && {
      country: validatedData.country,
    }),
    ...(validatedData.notes !== undefined && {
      notes: validatedData.notes,
    }),
    ...(validatedData.isActive !== undefined && {
      isActive: validatedData.isActive,
    }),
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
    country: supplier.country,
    notes: supplier.notes,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}
