"use server";

import { updateSupplier } from "../../../repos/suppliers";
import { updateSupplierSchema } from "../../../validations/schemas/supplier-schemas";

interface UserContext {
  employeeId?: number;
}

/**
 * Update an existing supplier
 * @param supplierId - The supplier ID to update
 * @param data - Supplier update data
 * @param context - User context for auditing
 * @returns Updated supplier information
 * @throws Error if validation fails or supplier not found
 */
export async function updateSupplierService(
  supplierId: number,
  data: any,
  context?: UserContext,
) {
  const validatedData = updateSupplierSchema.parse(data);

  const supplier = await updateSupplier(supplierId, {
    ...(validatedData.firstName && { firstName: validatedData.firstName }),
    ...(validatedData.lastName && { lastName: validatedData.lastName }),
    ...(validatedData.ci !== undefined && { ci: validatedData.ci }),
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
    ...(validatedData.birthDate !== undefined && {
      birthDate: validatedData.birthDate,
    }),
    ...(validatedData.partnerSince !== undefined && {
      partnerSince: validatedData.partnerSince,
    }),
    ...(validatedData.contractEndAt !== undefined && {
      contractEndAt: validatedData.contractEndAt,
    }),
    ...(validatedData.isIndefinite !== undefined && {
      isIndefinite: validatedData.isIndefinite,
    }),
    ...(validatedData.isActive !== undefined && {
      isActive: validatedData.isActive,
    }),
    FK_updatedBy: context?.employeeId,
  });

  return {
    id: supplier.PK_supplier,
    ci: (supplier as any).ci,
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
    birthDate: supplier.birthDate,
    partnerSince: supplier.partnerSince,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}
