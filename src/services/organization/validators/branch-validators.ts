// Validadores para create/update branch

export function validateCreateBranchDto(dto: any) {
  if (!dto || typeof dto.name !== "string" || !dto.name.trim()) {
    throw new Error("Invalid branch name");
  }
  // agregar más validaciones según necesidad
  return true;
}
