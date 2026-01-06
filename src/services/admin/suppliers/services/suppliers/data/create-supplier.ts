"use server";

import { getCompanyBySlug, createSupplier } from "../../../repos/suppliers";
import { createSupplierSchema } from "../../../validations/schemas/supplier-schemas";

/**
 * Create a new supplier
 * @param tenantId - The company slug/tenant identifier
 * @param data - Supplier creation data
 * @returns Created supplier information
 * @throws Error if validation fails or company not found
 */
export async function createSupplierService(tenantId: string, data: any) {
  const validatedData = createSupplierSchema.parse(data);

  const company = await getCompanyBySlug(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }

  const supplier = await createSupplier({
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    phone: validatedData.phone,
    email: validatedData.email,
    address: validatedData.address,
    city: validatedData.city,
    department: validatedData.department,
    country: validatedData.country,
    notes: validatedData.notes,
    FK_company: company.PK_company,
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
