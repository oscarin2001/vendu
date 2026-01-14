/**
 * Validación de campos inmutables de la compañía.
 * Una vez definidos en onboarding, name y slug NO pueden modificarse.
 */

export const IMMUTABLE_COMPANY_FIELDS = ["name", "slug"] as const;

export type ImmutableCompanyField = (typeof IMMUTABLE_COMPANY_FIELDS)[number];

export interface ImmutableFieldError {
  code: "IMMUTABLE_FIELD";
  field: ImmutableCompanyField;
  message: string;
}

/**
 * Verifica si el objeto de actualización contiene campos inmutables.
 * @returns Array de errores si hay campos inmutables, vacío si no.
 */
export function checkImmutableFields(
  updates: Record<string, unknown>
): ImmutableFieldError[] {
  const errors: ImmutableFieldError[] = [];

  for (const field of IMMUTABLE_COMPANY_FIELDS) {
    if (updates[field] !== undefined) {
      errors.push({
        code: "IMMUTABLE_FIELD",
        field,
        message: `El campo '${field}' no puede modificarse después del onboarding`,
      });
    }
  }

  return errors;
}

/**
 * Lanza error si hay campos inmutables en las actualizaciones.
 * Usar en handlers/actions para bloquear cambios.
 */
export function ensureNoImmutableFields(
  updates: Record<string, unknown>
): void {
  const errors = checkImmutableFields(updates);

  if (errors.length > 0) {
    const fields = errors.map((e) => e.field).join(", ");
    const err = new Error(
      `Los campos [${fields}] son inmutables y no pueden modificarse`
    );
    (err as any).code = "IMMUTABLE_COMPANY_FIELDS";
    (err as any).fields = errors.map((e) => e.field);
    throw err;
  }
}

/**
 * Elimina campos inmutables del objeto de actualización.
 * Útil como fallback defensivo en Prisma middleware.
 */
export function stripImmutableFields<T extends Record<string, unknown>>(
  updates: T
): Omit<T, ImmutableCompanyField> {
  const cleaned = { ...updates };

  for (const field of IMMUTABLE_COMPANY_FIELDS) {
    delete cleaned[field];
  }

  return cleaned as Omit<T, ImmutableCompanyField>;
}
