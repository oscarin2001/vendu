import { CompanyData, OwnerData, BranchData, WarehouseData, FiscalData } from "./types";

export function validateCompanyData(data: Partial<CompanyData>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Nombre de empresa requerido");
  if (!data.country?.trim()) errors.push("País requerido");
  if (!data.phone?.trim()) errors.push("Teléfono requerido");
  return errors;
}

export function validateOwnerData(data: Partial<OwnerData>): string[] {
  const errors: string[] = [];
  if (!data.firstName?.trim()) errors.push("Nombre requerido");
  if (!data.lastName?.trim()) errors.push("Apellido requerido");
  if (!data.phone?.trim()) errors.push("Teléfono requerido");
  return errors;
}

export function validateBranchData(data: Partial<BranchData>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Nombre de sucursal requerido");
  if (!data.address?.trim()) errors.push("Dirección requerida");
  if (!data.city?.trim()) errors.push("Ciudad requerida");
  if (!data.department?.trim()) errors.push("Departamento requerido");
  if (!data.country?.trim()) errors.push("País requerido");
  if (!data.phone?.trim()) errors.push("Teléfono requerido");
  return errors;
}

export function validateWarehouseData(data: Partial<WarehouseData>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Nombre de bodega requerido");
  if (!data.address?.trim()) errors.push("Dirección requerida");
  if (!data.city?.trim()) errors.push("Ciudad requerida");
  if (!data.department?.trim()) errors.push("Departamento requerido");
  if (!data.phone?.trim()) errors.push("Teléfono requerido");
  return errors;
}

// Fiscal data is optional, so minimal validation
export function validateFiscalData(data: Partial<FiscalData>): string[] {
  return []; // No required fields
}