/**
 * Address validation utilities
 * Max 150 lines per file
 */

import { getCountryConfigByName } from "../../config/types/countries";

/**
 * Validates that address is not empty and within limits
 */
export function validateAddress(address: string): string | null {
  if (!address.trim()) {
    return "La dirección es requerida";
  }

  if (address.length < 5) {
    return "La dirección debe tener al menos 5 caracteres";
  }

  if (address.length > 255) {
    return "La dirección no puede exceder 255 caracteres";
  }

  return null;
}

/**
 * Validates city name
 */
export function validateCity(city: string): string | null {
  if (!city.trim()) {
    return "La ciudad es requerida";
  }

  if (city.length < 2) {
    return "La ciudad debe tener al menos 2 caracteres";
  }

  if (city.length > 100) {
    return "La ciudad no puede exceder 100 caracteres";
  }

  return null;
}

/**
 * Gets departments/states for a country
 */
export function getDepartmentsForCountry(country: string): string[] {
  const config = getCountryConfigByName(country);
  return config?.departments ?? [];
}

/**
 * Validates department is valid for the country
 */
export function validateDepartment(
  department: string,
  country: string,
): string | null {
  if (!department.trim()) return null; // Department is optional

  const departments = getDepartmentsForCountry(country);
  if (departments.length === 0) return null; // No validation if no list

  if (!departments.includes(department)) {
    return "Selecciona un departamento válido";
  }

  return null;
}

/**
 * Validates country is supported
 */
export function validateCountry(country: string): string | null {
  if (!country.trim()) {
    return "El país es requerido";
  }

  const config = getCountryConfigByName(country);
  if (!config) {
    return "Selecciona un país válido";
  }

  return null;
}

/**
 * Gets all supported countries
 */
export function getSupportedCountries(): string[] {
  return [
    "Argentina",
    "Bolivia",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Ecuador",
    "El Salvador",
    "España",
    "Guatemala",
    "Honduras",
    "México",
    "Nicaragua",
    "Panamá",
    "Paraguay",
    "Perú",
    "República Dominicana",
    "Uruguay",
    "Venezuela",
  ];
}
