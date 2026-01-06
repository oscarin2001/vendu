import type { Supplier } from "../types/entities";

/**
 * Formats a supplier's full name
 */
export function formatSupplierName(supplier: Supplier): string {
  return supplier.fullName;
}

/**
 * Formats a supplier's display name with contact info
 */
export function formatSupplierDisplay(supplier: Supplier): string {
  const contact = supplier.email || supplier.phone || "";
  return contact ? `${supplier.fullName} (${contact})` : supplier.fullName;
}
