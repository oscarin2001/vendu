import "server-only";
import { createCompanyAndOwner } from "../../tenant/repos/tenant-repo";

/**
 * Converts a company name into a URL-friendly slug.
 * Example: "My Company Inc." becomes "my-company-inc"
 *
 * @param name - The company name to convert
 * @returns A slugified version of the name
 */
function slugify(name: string) {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

/**
 * Registers a new company with its owner and main branch.
 * This function handles company creation, ensuring unique slugs for URLs.
 *
 * @param input - Company registration data
 * @returns The created company and owner information
 */
export async function registerCompany(input: {
  name: string;
  taxId?: string;
  username: string;
  passwordHash: string;
  fullName?: string;
  branch: {
    address: string;
    city: string;
    department?: string;
    phone?: string;
    name?: string;
  };
}) {
  // Generate initial slug from company name
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let suffix = 1;

  // Keep trying to create the company until we find a unique slug
  // If slug exists, add a number suffix like "company-1", "company-2", etc.
  while (true) {
    try {
      // Attempt to create company with current slug
      const result = await createCompanyAndOwner({
        name: input.name,
        slug,
        taxId: input.taxId ?? null, // Convert undefined to null for database
        username: input.username,
        passwordHash: input.passwordHash,
        fullName: input.fullName,
        branch: input.branch,
      });
      return result; // Success! Return the created data
    } catch (err: any) {
      const message = String(err.message || "");
      // Check if error is due to duplicate slug (unique constraint violation)
      if (message.includes("Unique constraint") || message.includes("Unique")) {
        // Slug already exists, try next number
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
        continue; // Try again with new slug
      }
      // If it's a different error, re-throw it
      throw err;
    }
  }
}
