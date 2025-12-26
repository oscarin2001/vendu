/**
 * Normalizes branch input data by trimming whitespace and handling optional fields.
 * This ensures consistent data format before saving to the database.
 *
 * @param input - The raw branch data from user input
 * @returns Normalized branch data with trimmed strings and proper undefined values
 */
export function normalizeBranchInput(input: {
  address: string;
  city: string;
  department?: string;
  phone?: string;
  name?: string;
}) {
  return {
    address: (input.address || "").trim(), // Remove extra spaces from address
    city: (input.city || "").trim(), // Remove extra spaces from city
    department: input.department ? input.department.trim() : undefined, // Trim or keep undefined
    phone: input.phone ? input.phone.trim() : undefined, // Trim or keep undefined
    name: input.name ? input.name.trim() : undefined, // Trim or keep undefined
  };
}
