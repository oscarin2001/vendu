"use server";

import { validateAdminPassword } from "@/services/admin/managers";

/**
 * Validate admin password for warehouse operations
 * @param tenantId - Company slug
 * @param password - Admin password
 */
export async function validateWarehouseAdminPassword(
  tenantId: string,
  password: string
) {
  await validateAdminPassword(tenantId, "", password);
}
