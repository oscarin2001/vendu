"use client";

import { useMemo } from "react";
import type {
  ChangeTrackingResult,
  FieldChange,
  UseFormChangesOptions,
} from "./types";
import { areValuesEqual, formatValueForDisplay } from "./utils";

/**
 * Default labels for common fields across entities
 */
const DEFAULT_LABELS: Record<string, string> = {
  firstName: "Nombre",
  lastName: "Apellido",
  email: "Correo electrónico",
  phone: "Teléfono",
  password: "Contraseña",
  ci: "Cédula",
  address: "Dirección",
  city: "Ciudad",
  department: "Departamento",
  country: "País",
  salary: "Salario",
  hireDate: "Fecha de contratación",
  birthDate: "Fecha de nacimiento",
  joinedAt: "Fecha de ingreso",
  contractEndAt: "Fin de contrato",
  isIndefinite: "Contrato indefinido",
  contributionType: "Tipo de aporte",
  homeAddress: "Dirección de domicilio",
  name: "Nombre",
  notes: "Notas",
  branchIds: "Sucursales asignadas",
  isActive: "Estado activo",
  partnerSince: "Socio desde",
};

/**
 * Hook to track changes between initial and current form data
 * Returns utilities to detect, display and manage changes
 */
export function useFormChanges<T extends Record<string, unknown>>({
  initialData,
  currentData,
  fieldLabels = {},
  ignoreFields = [],
}: UseFormChangesOptions<T>): ChangeTrackingResult<T> {
  const result = useMemo(() => {
    const changes: FieldChange[] = [];
    const changedFields: string[] = [];
    const labels = { ...DEFAULT_LABELS, ...fieldLabels };

    if (!initialData) {
      return {
        hasChanges: false,
        changedFields: [],
        changes: [],
        getChangeSummary: () => "",
        isFieldChanged: () => false,
        getChangedData: () => ({} as Partial<T>),
      };
    }

    // Compare each field
    const allKeys = new Set([
      ...Object.keys(initialData),
      ...Object.keys(currentData),
    ]);

    for (const key of allKeys) {
      if (ignoreFields.includes(key as keyof T)) continue;
      if (key === "confirmPassword") continue; // Always ignore

      const oldValue = (initialData as Record<string, unknown>)[key];
      const newValue = (currentData as Record<string, unknown>)[key];

      if (!areValuesEqual(oldValue, newValue)) {
        changedFields.push(key);
        changes.push({
          field: key,
          label: labels[key] || key,
          oldValue,
          newValue,
        });
      }
    }

    const hasChanges = changedFields.length > 0;

    const getChangeSummary = (): string => {
      if (!hasChanges) return "No hay cambios";
      return changes
        .map(
          (c) =>
            `${c.label}: ${formatValueForDisplay(c.oldValue)} → ${formatValueForDisplay(c.newValue)}`,
        )
        .join("\n");
    };

    const isFieldChanged = (field: keyof T): boolean => {
      return changedFields.includes(field as string);
    };

    const getChangedData = (): Partial<T> => {
      const result: Partial<T> = {};
      for (const key of changedFields) {
        (result as Record<string, unknown>)[key] = (
          currentData as Record<string, unknown>
        )[key];
      }
      return result;
    };

    return {
      hasChanges,
      changedFields,
      changes,
      getChangeSummary,
      isFieldChanged,
      getChangedData,
    };
  }, [initialData, currentData, fieldLabels, ignoreFields]);

  return result;
}
