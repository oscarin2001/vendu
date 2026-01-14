"use server";

import { prisma } from "@/lib/prisma";
import { AuditOperation, Prisma } from "@prisma/client";

export interface AuditImmutableAttemptParams {
  companyId: number;
  employeeId?: number;
  attemptedFields: string[];
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Registra en audit_logs un intento de modificar campos inmutables.
 * Útil para trazabilidad y detección de intentos maliciosos.
 */
export async function logImmutableFieldAttempt(
  params: AuditImmutableAttemptParams
): Promise<void> {
  const { companyId, employeeId, attemptedFields, ipAddress, userAgent } =
    params;

  await prisma.tbaudit_logs.create({
    data: {
      entity: "COMPANY",
      entityId: companyId,
      action: AuditOperation.UPDATE,
      oldValue: Prisma.JsonNull,
      newValue: { attemptedFields, blocked: true },
      FK_employee: employeeId,
      FK_company: companyId,
      ipAddress,
      userAgent,
    },
  });
}

/**
 * Registra un cambio exitoso de configuración de compañía.
 */
export async function logCompanySettingsChange(params: {
  companyId: number;
  employeeId?: number;
  oldValues: Record<string, unknown>;
  newValues: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const { companyId, employeeId, oldValues, newValues, ipAddress, userAgent } =
    params;

  await prisma.tbaudit_logs.create({
    data: {
      entity: "COMPANY_SETTINGS",
      entityId: companyId,
      action: AuditOperation.UPDATE,
      oldValue: oldValues as Prisma.InputJsonValue,
      newValue: newValues as Prisma.InputJsonValue,
      FK_employee: employeeId,
      FK_company: companyId,
      ipAddress,
      userAgent,
    },
  });
}
