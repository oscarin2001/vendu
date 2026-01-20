/**
 * CI/DNI validation utilities - Country-specific document validation
 * Max 150 lines per file
 */

/**
 * CI/DNI max length configuration by country
 */
const CI_COUNTRY_CONFIG: Record<string, { maxLength: number; name: string }> = {
  Argentina: { maxLength: 8, name: "DNI" },
  Bolivia: { maxLength: 10, name: "CI" },
  Chile: { maxLength: 9, name: "RUT" },
  Colombia: { maxLength: 10, name: "CC" },
  "Costa Rica": { maxLength: 9, name: "Cédula" },
  Cuba: { maxLength: 11, name: "CI" },
  Ecuador: { maxLength: 10, name: "CI" },
  "El Salvador": { maxLength: 9, name: "DUI" },
  España: { maxLength: 9, name: "DNI" },
  Guatemala: { maxLength: 13, name: "DPI" },
  Honduras: { maxLength: 13, name: "Identidad" },
  México: { maxLength: 13, name: "CURP" },
  Nicaragua: { maxLength: 14, name: "Cédula" },
  Panamá: { maxLength: 15, name: "Cédula" },
  Paraguay: { maxLength: 8, name: "CI" },
  Perú: { maxLength: 8, name: "DNI" },
  "República Dominicana": { maxLength: 11, name: "Cédula" },
  Uruguay: { maxLength: 8, name: "CI" },
  Venezuela: { maxLength: 10, name: "CI" },
};

/**
 * Gets CI/DNI configuration for a country
 */
export function getCIConfigForCountry(
  country: string,
): { maxLength: number; name: string } | null {
  return CI_COUNTRY_CONFIG[country] ?? null;
}

/**
 * Validates CI/DNI based on country rules
 * @param ci - The CI/DNI value
 * @param country - The country code
 * @returns Error message or null if valid
 */
export function validateCIByCountry(
  ci: string,
  country: string,
): string | null {
  if (!ci.trim()) return null;

  const config = CI_COUNTRY_CONFIG[country];
  if (!config) return null;

  // Remove non-alphanumeric characters for validation
  const cleanCI = ci.replace(/[^a-zA-Z0-9]/g, "");

  if (cleanCI.length > config.maxLength) {
    return `El ${config.name} no puede exceder ${config.maxLength} caracteres`;
  }

  return null;
}

/**
 * Filters CI input to only allow alphanumeric characters
 * @param input - Raw input string
 * @param country - Country for length restriction
 * @returns Filtered CI string
 */
export function filterCIInput(input: string, country?: string): string {
  // Remove non-alphanumeric characters
  const filtered = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Apply max length if country specified
  if (country) {
    const config = CI_COUNTRY_CONFIG[country];
    if (config && filtered.length > config.maxLength) {
      return filtered.slice(0, config.maxLength);
    }
  }

  return filtered;
}

/**
 * Gets a short placeholder example for CI input
 */
export function getCIPlaceholder(country?: string): string {
  if (!country) return "Ej: 1234";

  const config = CI_COUNTRY_CONFIG[country];
  if (!config) return "Ej: 1234";

  return "Ej: 1234";
}

/**
 * Gets the document name for a country (CI, DNI, etc.)
 */
export function getCIDocumentName(country: string): string {
  const config = CI_COUNTRY_CONFIG[country];
  return config?.name ?? "CI/DNI";
}

/**
 * Returns the list of all supported countries for CI validation
 */
export function getSupportedCICountries(): string[] {
  return Object.keys(CI_COUNTRY_CONFIG);
}
