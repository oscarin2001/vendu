/**
 * Salary validation utilities - Currency-aware salary limits
 * Max 150 lines per file
 */

import { getCountryConfigByName } from "../../config/types/countries";

/**
 * Salary limits per currency (min and max monthly salary)
 */
const SALARY_LIMITS: Record<string, { min: number; max: number }> = {
  BOB: { min: 2500, max: 100000 }, // Bolivia - Bs 2,500 to 100,000
  ARS: { min: 100000, max: 10000000 }, // Argentina - $ 100,000 to 10,000,000
  CLP: { min: 350000, max: 15000000 }, // Chile - $ 350,000 to 15,000,000
  COP: { min: 1160000, max: 50000000 }, // Colombia - $ 1,160,000 to 50,000,000
  PEN: { min: 1025, max: 50000 }, // Perú - S/ 1,025 to 50,000
  USD: { min: 300, max: 50000 }, // USD generic
  MXN: { min: 7000, max: 500000 }, // México - $ 7,000 to 500,000
  EUR: { min: 1000, max: 50000 }, // Euro generic
  PYG: { min: 2680373, max: 50000000 }, // Paraguay
  UYU: { min: 19364, max: 500000 }, // Uruguay
  VES: { min: 130, max: 10000 }, // Venezuela (varies a lot)
  GTQ: { min: 3073, max: 100000 }, // Guatemala
  HNL: { min: 10700, max: 200000 }, // Honduras
  NIO: { min: 6000, max: 150000 }, // Nicaragua
  CRC: { min: 300000, max: 10000000 }, // Costa Rica
  PAB: { min: 500, max: 50000 }, // Panamá (uses USD too)
  DOP: { min: 21000, max: 500000 }, // República Dominicana
  CUP: { min: 2100, max: 50000 }, // Cuba
};

/**
 * Gets salary limits for a currency
 */
export function getSalaryLimitsForCurrency(
  currencyCode: string,
): { min: number; max: number } | null {
  return SALARY_LIMITS[currencyCode] ?? null;
}

/**
 * Validates salary based on currency limits
 * @param salary - The salary value
 * @param currencyCode - The currency code (BOB, USD, etc.)
 * @returns Error message or null if valid
 */
export function validateSalaryByCurrency(
  salary: number,
  currencyCode: string,
): string | null {
  if (salary <= 0) {
    return "El salario debe ser mayor a 0";
  }

  const limits = SALARY_LIMITS[currencyCode];
  if (!limits) return null;

  if (salary < limits.min) {
    return `El salario mínimo es ${formatSalary(limits.min, currencyCode)}`;
  }

  if (salary > limits.max) {
    return `El salario máximo es ${formatSalary(limits.max, currencyCode)}`;
  }

  return null;
}

/**
 * Validates salary based on country (uses country's currency)
 * @param salary - The salary value
 * @param country - The country name
 * @returns Error message or null if valid
 */
export function validateSalaryByCountry(
  salary: number,
  country: string,
): string | null {
  const config = getCountryConfigByName(country);
  if (!config) return null;

  return validateSalaryByCurrency(salary, config.currency.code);
}

/**
 * Formats salary with currency symbol
 */
export function formatSalary(amount: number, currencyCode: string): string {
  const symbols: Record<string, string> = {
    BOB: "Bs",
    ARS: "$",
    CLP: "$",
    COP: "$",
    PEN: "S/",
    USD: "$",
    MXN: "$",
    EUR: "€",
    PYG: "₲",
    UYU: "$",
    VES: "Bs",
    GTQ: "Q",
    HNL: "L",
    NIO: "C$",
    CRC: "₡",
    PAB: "B/.",
    DOP: "RD$",
    CUP: "$",
  };

  const symbol = symbols[currencyCode] ?? currencyCode;
  return `${symbol} ${amount.toLocaleString()}`;
}

/**
 * Gets a salary hint based on country
 */
export function getSalaryHint(country: string): string {
  const config = getCountryConfigByName(country);
  if (!config) return "";

  const limits = SALARY_LIMITS[config.currency.code];
  if (!limits) return "";

  const min = formatSalary(limits.min, config.currency.code);
  const max = formatSalary(limits.max, config.currency.code);
  return `Rango: ${min} - ${max}`;
}

/**
 * Gets currency symbol for a country
 */
export function getCurrencySymbol(country: string): string {
  const config = getCountryConfigByName(country);
  return config?.currency.symbol ?? "$";
}

/**
 * Gets currency code for a country
 */
export function getCurrencyCode(country: string): string {
  const config = getCountryConfigByName(country);
  return config?.currency.code ?? "USD";
}
