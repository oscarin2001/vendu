"use server";

import { provisionTenant } from "@/services/tenant/services/tenant-provision-service";

export async function createTenantAction(_form: any) {
  // Server Action: validar input mínimo y delegar a services/tenant
  // Implementación real debe validar y sanitizar
  return provisionTenant(_form);
}
