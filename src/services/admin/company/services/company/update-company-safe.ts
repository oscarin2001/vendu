"use server";

import { prisma } from "@/lib/prisma";
import { getAuthCookie } from "@/services/auth/adapters";
import {
  ensureNoImmutableFields,
  checkImmutableFields,
} from "../../validations/immutable-fields";
import {
  logImmutableFieldAttempt,
  logCompanySettingsChange,
} from "../audit-company-changes";

export interface UpdateCompanySettingsParams {
  companyId: number;
  updates: {
    taxId?: string;
    businessName?: string;
    fiscalAddress?: string;
    department?: string;
  };
}

export interface UpdateCompanySettingsResult {
  success: boolean;
  error?: string;
  blockedFields?: string[];
}

/**
 * Actualiza configuración de compañía de forma segura.
 * Bloquea cambios a campos inmutables (name, slug).
 */
export async function updateCompanySettingsSafe(
  params: UpdateCompanySettingsParams
): Promise<UpdateCompanySettingsResult> {
  const { companyId, updates } = params;

  try {
    const auth = await getAuthCookie();
    if (!auth) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar intentos de modificar campos inmutables
    const immutableErrors = checkImmutableFields(
      updates as Record<string, unknown>
    );

    if (immutableErrors.length > 0) {
      // Registrar intento bloqueado
      await logImmutableFieldAttempt({
        companyId,
        employeeId: auth.userId,
        attemptedFields: immutableErrors.map((err) => err.field),
      });

      return {
        success: false,
        error: "Los campos nombre y URL no pueden modificarse",
        blockedFields: immutableErrors.map((err) => err.field),
      };
    }

    // Bloqueo defensivo (lanza error si hay campos inmutables)
    ensureNoImmutableFields(updates as Record<string, unknown>);

    // Obtener valores actuales para auditoría
    const current = await prisma.tbcompanies.findUnique({
      where: { PK_company: companyId },
      select: {
        taxId: true,
        businessName: true,
        fiscalAddress: true,
        department: true,
      },
    });

    if (!current) {
      return { success: false, error: "Compañía no encontrada" };
    }

    // Actualizar solo campos permitidos
    const updated = await prisma.tbcompanies.update({
      where: { PK_company: companyId },
      data: {
        taxId: updates.taxId,
        businessName: updates.businessName,
        fiscalAddress: updates.fiscalAddress,
        department: updates.department,
      },
    });

    // Registrar cambio exitoso
    await logCompanySettingsChange({
      companyId,
      employeeId: auth.userId,
      oldValues: current,
      newValues: updates,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating company settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
