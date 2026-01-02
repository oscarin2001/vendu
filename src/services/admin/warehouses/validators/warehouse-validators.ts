// Validadores para create/update warehouse

export function validateCreateWarehouseDto(dto: any) {
  if (!dto || typeof dto.name !== "string" || !dto.name.trim()) {
    throw new Error("Invalid warehouse name");
  }
  if (!dto.address || typeof dto.address !== "string" || !dto.address.trim()) {
    throw new Error("Invalid warehouse address");
  }
  if (!dto.city || typeof dto.city !== "string" || !dto.city.trim()) {
    throw new Error("Invalid warehouse city");
  }
  // agregar más validaciones según necesidad
  return true;
}

export function validateUpdateWarehouseDto(dto: any) {
  if (!dto || typeof dto !== "object") {
    throw new Error("Invalid warehouse update data");
  }
  // Validaciones opcionales para updates
  return true;
}
