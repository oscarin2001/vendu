// Utility functions for warehouse operations

/**
 * Normalizes warehouse input data by trimming whitespace and handling optional fields.
 * This ensures consistent data format before saving to the database.
 */
export function normalizeWarehouseInput(input: {
  address?: string;
  city?: string;
  department?: string;
  phone?: string;
  name?: string;
}) {
  return {
    address: (input.address || "").trim(),
    city: (input.city || "").trim(),
    department: input.department ? input.department.trim() : undefined,
    phone: input.phone ? input.phone.trim() : undefined,
    name: input.name ? input.name.trim() : undefined,
  };
}
