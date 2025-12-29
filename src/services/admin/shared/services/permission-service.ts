// Permission service: reglas de autorización por rol

export function canCreateBranch(
  actor: { role: string },
  companyId: number
): boolean {
  // Implementar reglas reales: Owner y SuperAdmin pueden crear
  return actor.role === "OWNER" || actor.role === "SUPER_ADMIN";
}
