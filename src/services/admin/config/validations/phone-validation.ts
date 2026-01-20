import { getCountryConfigByName } from "../types/countries";

/**
 * Reglas de validación de teléfono por país.
 * Cada país puede tener: allowedStartDigits, minLength, maxLength.
 */
type PhoneCountryRule = {
  allowedStartDigits?: string[];
  minLength?: number;
  maxLength?: number;
};

/**
 * Reglas de validación de teléfono por país.
 * allowedStartDigits: dígitos con los que puede comenzar el número local.
 */
const PHONE_COUNTRY_RULES: Record<string, PhoneCountryRule> = {
  Argentina: {
    allowedStartDigits: ["1", "2", "3"], // Códigos de área empiezan con 1, 2, 3
    minLength: 9,
    maxLength: 10,
  },
  Bolivia: {
    allowedStartDigits: ["6", "7"], // Celulares empiezan con 6 o 7
    minLength: 8,
    maxLength: 8,
  },
  Chile: {
    allowedStartDigits: ["9"], // Celulares empiezan con 9
    minLength: 9,
    maxLength: 9,
  },
  Colombia: {
    allowedStartDigits: ["3"], // Celulares empiezan con 3
    minLength: 10,
    maxLength: 10,
  },
  "Costa Rica": {
    allowedStartDigits: ["5", "6", "7", "8"], // Celulares
    minLength: 8,
    maxLength: 8,
  },
  Cuba: {
    allowedStartDigits: ["5"], // Celulares empiezan con 5
    minLength: 8,
    maxLength: 8,
  },
  Ecuador: {
    allowedStartDigits: ["9"], // Celulares empiezan con 9
    minLength: 9,
    maxLength: 9,
  },
  "El Salvador": {
    allowedStartDigits: ["6", "7"], // Celulares
    minLength: 8,
    maxLength: 8,
  },
  España: {
    allowedStartDigits: ["6", "7"], // Celulares empiezan con 6 o 7
    minLength: 9,
    maxLength: 9,
  },
  Guatemala: {
    allowedStartDigits: ["3", "4", "5"], // Celulares
    minLength: 8,
    maxLength: 8,
  },
  Honduras: {
    allowedStartDigits: ["3", "8", "9"], // Celulares
    minLength: 8,
    maxLength: 8,
  },
  México: {
    allowedStartDigits: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], // Códigos de área variados
    minLength: 10,
    maxLength: 10,
  },
  Nicaragua: {
    allowedStartDigits: ["5", "7", "8"], // Celulares
    minLength: 8,
    maxLength: 8,
  },
  Panamá: {
    allowedStartDigits: ["6"], // Celulares empiezan con 6
    minLength: 8,
    maxLength: 8,
  },
  Paraguay: {
    allowedStartDigits: ["9"], // Celulares empiezan con 9
    minLength: 9,
    maxLength: 9,
  },
  Perú: {
    allowedStartDigits: ["9"], // Celulares empiezan con 9
    minLength: 9,
    maxLength: 9,
  },
  "República Dominicana": {
    allowedStartDigits: ["8", "9"], // Celulares
    minLength: 10,
    maxLength: 10,
  },
  Uruguay: {
    allowedStartDigits: ["9"], // Celulares empiezan con 9
    minLength: 8,
    maxLength: 8,
  },
  Venezuela: {
    allowedStartDigits: ["4"], // Celulares empiezan con 4
    minLength: 10,
    maxLength: 10,
  },
};

/**
 * Obtiene las reglas de validación de teléfono para un país.
 */
export function getPhoneRulesForCountry(
  country: string,
): PhoneCountryRule | null {
  return PHONE_COUNTRY_RULES[country] ?? null;
}

/**
 * Valida el teléfono según las reglas del país.
 * Retorna un mensaje de error o null si es válido.
 */
export function validatePhoneByCountry(
  phone: string,
  country: string,
): string | null {
  if (!phone.trim()) return null;

  const config = getCountryConfigByName(country);
  const prefix = config?.phone.prefix ?? "";
  const digits = phone.replace(/\D/g, "");

  // Extraer dígitos locales (sin prefijo)
  let localDigits = digits;
  if (prefix && digits.startsWith(prefix)) {
    localDigits = digits.slice(prefix.length);
  }

  const rules = PHONE_COUNTRY_RULES[country];
  if (!rules) return null;

  // Validar dígito inicial permitido
  if (rules.allowedStartDigits && localDigits.length > 0) {
    const firstDigit = localDigits[0];
    if (!rules.allowedStartDigits.includes(firstDigit)) {
      return `El número debe comenzar con ${rules.allowedStartDigits.join(" o ")}`;
    }
  }

  // Validar longitud mínima
  if (rules.minLength && localDigits.length < rules.minLength) {
    const missing = rules.minLength - localDigits.length;
    return `Faltan ${missing} dígito${missing === 1 ? "" : "s"}`;
  }

  // Validar longitud máxima
  if (rules.maxLength && localDigits.length > rules.maxLength) {
    return `Máximo ${rules.maxLength} dígitos`;
  }

  return null;
}

/**
 * Valida cantidad de dígitos faltantes (legado).
 */
export function getPhoneMissingDigitsMessage(
  phone: string,
  country: string,
): string | null {
  if (!phone.trim()) return null;

  const digits = phone.replace(/\D/g, "");
  const config = getCountryConfigByName(country);
  const prefix = config?.phone.prefix ?? "";
  const expectedLocal = config?.phone.local ?? 8;

  let localDigitsLength = digits.length;
  if (prefix && digits.startsWith(prefix)) {
    localDigitsLength = digits.slice(prefix.length).length;
  }

  const missing = Math.max(0, expectedLocal - localDigitsLength);
  if (missing > 0) {
    return `Faltan ${missing} dígito${missing === 1 ? "" : "s"}`;
  }

  // Validación adicional por país (ej: Bolivia 6/7)
  return validatePhoneByCountry(phone, country);
}

/**
 * Filtra el primer dígito del teléfono si no es válido para el país.
 * Usado para validación en tiempo real mientras el usuario escribe.
 * Retorna el valor filtrado (sin el primer dígito si no es válido).
 */
export function filterPhoneFirstDigit(
  localDigits: string,
  country: string,
): string {
  if (!localDigits || localDigits.length === 0) return localDigits;

  const rules = PHONE_COUNTRY_RULES[country];
  if (!rules || !rules.allowedStartDigits) return localDigits;

  const firstDigit = localDigits[0];
  if (!rules.allowedStartDigits.includes(firstDigit)) {
    // Rechazar el primer dígito inválido
    return localDigits.slice(1);
  }

  return localDigits;
}

/**
 * Obtiene mensaje de ayuda sobre dígitos válidos para iniciar el teléfono.
 */
export function getPhoneStartDigitsHint(country: string): string | null {
  const rules = PHONE_COUNTRY_RULES[country];
  if (!rules || !rules.allowedStartDigits) return null;
  return `Debe comenzar con ${rules.allowedStartDigits.join(" o ")}`;
}
