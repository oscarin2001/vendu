"use server";

import { validateAdminPassword } from "@/services/admin/managers";

interface ValidateWarehousePasswordParams {
  tenantId: string;
  password: string;
  employeeId?: number;
}

/**
 * Validate admin password for warehouse operations
 * @param params - Validation parameters including tenantId, password and employeeId
 */
export async function validateWarehouseAdminPassword(
  params: ValidateWarehousePasswordParams,
) {
  await validateAdminPassword({
    tenantId: params.tenantId,
    employeeId: params.employeeId,
    password: params.password,
  });
}
