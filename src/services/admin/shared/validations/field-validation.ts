/**
 * Field validation utilities with character limits
 * For professional form validation across all admin modules
 */

/**
 * Field configuration with character limits and validation rules
 */
export const FIELD_LIMITS = {
  // Names
  warehouseName: { min: 2, max: 50, label: "nombre de bodega" },
  branchName: { min: 2, max: 50, label: "nombre de sucursal" },
  firstName: { min: 2, max: 20, label: "nombre" },
  lastName: { min: 2, max: 20, label: "apellido" },

  // Location
  address: { min: 5, max: 100, label: "dirección" },
  city: { min: 2, max: 40, label: "ciudad" },
  department: { min: 2, max: 40, label: "departamento" },

  // Other
  notes: { min: 0, max: 500, label: "notas" },
  homeAddress: { min: 0, max: 300, label: "dirección personal" },
} as const;

/**
 * Regex patterns for validation
 */
const PATTERNS = {
  lettersOnly: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
  lettersAndNumbers: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,#/]+$/,
  numbersOnly: /^[0-9]+$/,
};

/**
 * Filter city input - only letters and spaces allowed (no numbers)
 */
export function filterCityInput(input: string): string {
  return input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]/g, "");
}

/**
 * Validate city - must contain only letters
 */
export function validateCityName(city: string): string | null {
  if (!city.trim()) {
    return "La ciudad es requerida";
  }

  if (!PATTERNS.lettersOnly.test(city)) {
    return "La ciudad solo puede contener letras";
  }

  const limits = FIELD_LIMITS.city;
  if (city.length < limits.min) {
    return `La ${limits.label} debe tener al menos ${limits.min} caracteres`;
  }

  if (city.length > limits.max) {
    return `La ${limits.label} no puede exceder ${limits.max} caracteres`;
  }

  return null;
}

/**
 * Filter warehouse/branch name - letters, numbers, spaces, hyphens
 */
export function filterEntityName(input: string, maxLength: number): string {
  const filtered = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-]/g, "");
  return filtered.slice(0, maxLength);
}

/**
 * Validate warehouse name with character limits
 */
export function validateWarehouseName(name: string): string | null {
  if (!name.trim()) {
    return "El nombre de la bodega es requerido";
  }

  const limits = FIELD_LIMITS.warehouseName;
  if (name.length < limits.min) {
    return `El ${limits.label} debe tener al menos ${limits.min} caracteres`;
  }

  if (name.length > limits.max) {
    return `El ${limits.label} no puede exceder ${limits.max} caracteres`;
  }

  return null;
}

/**
 * Validate branch name with character limits
 */
export function validateBranchName(name: string): string | null {
  if (!name.trim()) {
    return "El nombre de la sucursal es requerido";
  }

  const limits = FIELD_LIMITS.branchName;
  if (name.length < limits.min) {
    return `El ${limits.label} debe tener al menos ${limits.min} caracteres`;
  }

  if (name.length > limits.max) {
    return `El ${limits.label} no puede exceder ${limits.max} caracteres`;
  }

  return null;
}

/**
 * Filter address input - letters, numbers, common address characters
 */
export function filterAddressInput(input: string, maxLength: number): string {
  const filtered = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,#/]/g, "");
  return filtered.slice(0, maxLength);
}

/**
 * Validate address with character limits
 */
export function validateAddressField(address: string): string | null {
  if (!address.trim()) {
    return "La dirección es requerida";
  }

  const limits = FIELD_LIMITS.address;
  if (address.length < limits.min) {
    return `La ${limits.label} debe tener al menos ${limits.min} caracteres`;
  }

  if (address.length > limits.max) {
    return `La ${limits.label} no puede exceder ${limits.max} caracteres`;
  }

  return null;
}

/**
 * Get placeholder with character limit hint
 */
export function getPlaceholderWithLimit(
  placeholder: string,
  fieldKey: keyof typeof FIELD_LIMITS,
): string {
  const limits = FIELD_LIMITS[fieldKey];
  return `${placeholder} (máx. ${limits.max} car.)`;
}

/**
 * Get remaining characters message
 */
export function getRemainingChars(
  currentLength: number,
  fieldKey: keyof typeof FIELD_LIMITS,
): string {
  const limits = FIELD_LIMITS[fieldKey];
  const remaining = limits.max - currentLength;
  return `${remaining} caracteres restantes`;
}
