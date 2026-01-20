"use server";

import { getCompanyBySlug, createSupplier } from "../../../repos/suppliers";
import { createSupplierSchema } from "../../../validations/schemas/supplier-schemas";

interface UserContext {
  employeeId?: number;
}

/**
 * Create a new supplier
 * @param tenantId - The company slug/tenant identifier
 * @param data - Supplier creation data
 * @param context - User context for auditing
 * @returns Created supplier information
 * @throws Error if validation fails or company not found
 */
export async function createSupplierService(
  tenantId: string,
  data: any,
  context?: UserContext,
) {
  const validatedData = createSupplierSchema.parse(data);

  const company = await getCompanyBySlug(tenantId);
  if (!company) {
    throw new Error("Company not found");
  }

  const supplier = await createSupplier({
    ci: validatedData.ci,
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    phone: validatedData.phone,
    email: validatedData.email,
    address: validatedData.address,
    city: validatedData.city,
    department: validatedData.department,
    country: validatedData.country,
    notes: validatedData.notes,
    birthDate: validatedData.birthDate, // Fecha de nacimiento
    partnerSince: validatedData.partnerSince, // Desde cuándo trabaja con la empresa
    FK_company: company.PK_company,
    FK_createdBy: context?.employeeId,
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
    notes: supplier.notes,
    birthDate: supplier.birthDate,
    partnerSince: supplier.partnerSince,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
  };
}
