"use server";

import { getSupplierById } from "../../../repos/suppliers";

/**
 * Get a supplier by ID
 * @param supplierId - The supplier ID
 * @returns Supplier information or null if not found
 */
export async function getSupplierByIdService(supplierId: number) {
  const supplier = await getSupplierById(supplierId);

  if (!supplier) return null;

  return {
    id: supplier.PK_supplier,
    firstName: supplier.firstName,
    lastName: supplier.lastName,
    fullName: `${supplier.firstName} ${supplier.lastName}`,
    ci: (supplier as any).ci,
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
  };
}
