/**
 * Name validation utilities - Only letters and spaces allowed
 * Max 150 lines per file
 */

/**
 * RegEx for names - only letters (including accented) and spaces
 */
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

/**
 * Validates that a name contains only letters and spaces
 * @param name - The name to validate
 * @returns Error message or null if valid
 */
export function validateNameLettersOnly(name: string): string | null {
  if (!name.trim()) return null;

  if (!NAME_REGEX.test(name)) {
    return "El nombre solo puede contener letras";
  }

  return null;
}

/**
 * Filters input to only allow letters and spaces in real-time
 * @param input - The input string
 * @returns Filtered string with only letters and spaces
 */
export function filterNameInput(input: string): string {
  // Remove any character that's not a letter or space
  return input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
}

/**
 * Validates first name with length constraints
 */
export function validateFirstName(firstName: string): string | null {
  if (!firstName.trim()) {
    return "El nombre es requerido";
  }

  if (firstName.length < 2) {
    return "El nombre debe tener al menos 2 caracteres";
  }

  if (firstName.length > 50) {
    return "El nombre no puede exceder 50 caracteres";
  }

  return validateNameLettersOnly(firstName);
}

/**
 * Validates last name with length constraints
 */
export function validateLastName(lastName: string): string | null {
  if (!lastName.trim()) {
    return "El apellido es requerido";
  }

  if (lastName.length < 2) {
    return "El apellido debe tener al menos 2 caracteres";
  }

  if (lastName.length > 50) {
    return "El apellido no puede exceder 50 caracteres";
  }

  return validateNameLettersOnly(lastName);
}

/**
 * Validates a business/entity name (allows numbers for businesses)
 */
export function validateBusinessName(name: string): string | null {
  if (!name.trim()) {
    return "El nombre es requerido";
  }

  if (name.length < 2) {
    return "El nombre debe tener al menos 2 caracteres";
  }

  if (name.length > 100) {
    return "El nombre no puede exceder 100 caracteres";
  }

  return null;
}
