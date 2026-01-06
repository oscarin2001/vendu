// Wrapper that keeps compatibility with either password-based deletion (legacy) or new validation-based deletion
import { deleteWarehouseForCompany } from "../data/delete-warehouse";
import { deleteWarehouse as legacyDeleteWarehouse } from "../delete-warehouse";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

export async function deleteWarehouse(
  tenantId: string,
  warehouseId: number,
  passwordOrContext?: string | UserContext,
  context?: UserContext
) {
  // If a password string is provided, call the legacy implementation that validates admin password
  if (typeof passwordOrContext === "string") {
    return await legacyDeleteWarehouse(
      tenantId,
      warehouseId,
      passwordOrContext,
      context
    );
  }

  // Otherwise call the new validation-based deletion
  return await deleteWarehouseForCompany(
    tenantId,
    warehouseId,
    passwordOrContext as UserContext | undefined
  );
}
