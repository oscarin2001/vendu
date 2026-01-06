"use server";

import { getSuppliersByCompany } from "../../../repos/suppliers";

/**
 * Get all suppliers for a specific company/tenant
 * @param tenantId - The company slug/tenant identifier
 * @returns Array of suppliers with manager assignments
 */
export async function getSuppliersByCompanyService(tenantId: string) {
  const suppliers = await getSuppliersByCompany(tenantId);

  return suppliers.map((supplier: any) => ({
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
    managers: supplier.supplierManagers.map((sm: any) => ({
      id: sm.manager.PK_employee,
      name: `${sm.manager.firstName} ${sm.manager.lastName}`,
      email: sm.manager.auth.username,
    })),
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  }));
}
