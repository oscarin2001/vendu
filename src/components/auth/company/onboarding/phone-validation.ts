import { getCountryConfigByName } from "@/services/admin/config/countries";

export function getPhoneMissingDigitsMessage(
  phone: string,
  country: string
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

  return null;
}
