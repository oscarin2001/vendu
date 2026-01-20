import {
  getPhoneMissingDigitsMessage,
  validatePhoneByCountry,
} from "@/services/admin/config";
import { OwnerFormData } from "./types";

/**
 * Validates owner form fields and returns errors object.
 */
export function validateOwnerForm(
  data: OwnerFormData,
  companyCountry: string,
  phoneValid: boolean | null,
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Nombre
  if (!data.firstName.trim()) {
    errors.firstName = "Nombre requerido";
  } else if (/\d/.test(data.firstName)) {
    errors.firstName = "No se permiten números";
  }

  // Apellido
  if (!data.lastName.trim()) {
    errors.lastName = "Apellido requerido";
  } else if (/\d/.test(data.lastName)) {
    errors.lastName = "No se permiten números";
  }

  // Teléfono
  if (!data.phone.trim()) {
    errors.phone = "Teléfono requerido";
  } else {
    // Validación de dígitos faltantes
    const phoneMessage = getPhoneMissingDigitsMessage(
      data.phone,
      companyCountry,
    );
    if (phoneMessage) {
      errors.phone = phoneMessage;
    }

    // Validación por país (ej: Bolivia debe empezar con 6 o 7)
    const countryPhoneError = validatePhoneByCountry(
      data.phone,
      companyCountry,
    );
    if (countryPhoneError && !errors.phone) {
      errors.phone = countryPhoneError;
    }

    if (phoneValid === false && !errors.phone) {
      errors.phone = "Teléfono inválido";
    }
  }

  // CI/DNI
  if (!data.ci.trim()) {
    errors.ci = "CI/DNI requerido";
  }

  // Género
  if (!data.gender) {
    errors.gender = "Selecciona género";
  }

  return errors;
}

/**
 * Sanitizes text to remove digits (for name fields).
 */
export function sanitizeNameInput(value: string): string {
  return value.replace(/\d/g, "");
}

/**
 * Sanitizes CI to only allow digits.
 */
export function sanitizeCiInput(value: string): string {
  return value.replace(/\D/g, "");
}
