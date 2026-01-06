/**
 * Obtiene los datos básicos de una compañía por su tenant ID
 *
 * @param tenantId - El identificador único del tenant/compañía
 * @returns Objeto con los datos de la compañía (name, etc.)
 * @throws Error si la compañía no se encuentra
 */

"use server";

import { getCompanyByTenant } from "../get-company-by-tenant";

export async function getCompanyData(tenantId: string) {
  try {
    const company = await getCompanyByTenant(tenantId);
    return {
      name: company.name,
      // Add other fields as needed
    };
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Company not found");
  }
}
