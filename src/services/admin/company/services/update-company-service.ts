/**
 * Servicio para actualizar la información básica de la empresa.
 * Maneja la lógica de negocio para modificar datos de la compañía.
 */

export interface UpdateCompanyInput {
  name?: string;
  nit?: string;
  country?: string;
  address?: string;
  // otros campos
}

export async function updateCompany(companyId: string, input: UpdateCompanyInput) {
  // TODO: Implementar lógica
  // 1. Validar input
  // 2. Verificar permisos (solo owner/admin)
  // 3. Actualizar en DB
  // 4. Log de cambios

  throw new Error("updateCompany not implemented yet");
}

export async function getCompanyInfo(companyId: string) {
  // TODO: Obtener info de la empresa
  throw new Error("getCompanyInfo not implemented yet");
}