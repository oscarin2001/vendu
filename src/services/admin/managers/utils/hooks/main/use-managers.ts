"use client";

import { useCompany } from "@/services/admin/company";
import { useManagerState } from "../data/use-manager-state";
import { useManagerFilters } from "../ui/use-manager-filters";
import { useManagerOperations } from "../actions/use-manager-operations";

/**
 * Main hook for manager management
 * Combines state, filters, and operations into a single interface
 */
export function useManagers(tenantId: string) {
  // Get company data for email domain validation
  const { company } = useCompany(tenantId);

  // State management
  const {
    managers: allManagers,
    setManagers,
    metrics,
    isLoading,
    error,
    refresh,
  } = useManagerState(tenantId);

  // Filtering logic
  const {
    filters,
    filteredManagers,
    updateSearch,
    updateBranch,
    updateStatus,
    clearFilters,
  } = useManagerFilters(allManagers);

  // CRUD operations
  const {
    createManager,
    updateManager,
    deleteManager,
    toggleManagerStatus,
    assignBranch,
    removeBranch,
  } = useManagerOperations(tenantId, refresh);

  // Validation functions
  const validateManagerEmail = (email: string): boolean => {
    if (!company?.slug) return false;
    const expectedDomain = `@${company.slug}.com`;
    return email.endsWith(expectedDomain);
  };

  const validateCreateManagerData = (data: any): string | null => {
    if (!data.firstName?.trim()) return "El nombre es requerido";
    if (!data.lastName?.trim()) return "El apellido es requerido";
    if (!data.ci?.trim()) return "La cédula es requerida";
    if (!data.email?.trim()) return "El correo electrónico es requerido";
    if (!data.password?.trim()) return "La contraseña es requerida";

    // Password validation: 8 chars min, at least one uppercase, max 72
    if (data.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (data.password.length > 72) {
      return "La contraseña no puede exceder 72 caracteres";
    }
    if (!/[A-Z]/.test(data.password)) {
      return "La contraseña debe contener al menos una mayúscula";
    }

    if (!validateManagerEmail(data.email)) {
      return `El correo debe terminar en @${company?.slug}.com`;
    }
    return null;
  };

  const validateUpdateManagerData = (data: any): string | null => {
    if (data.firstName !== undefined && !data.firstName?.trim())
      return "El nombre es requerido";
    if (data.lastName !== undefined && !data.lastName?.trim())
      return "El apellido es requerido";
    if (data.ci !== undefined && !data.ci?.trim())
      return "La cédula es requerida";
    if (data.email !== undefined && !data.email?.trim())
      return "El correo electrónico es requerido";
    if (data.email && !validateManagerEmail(data.email)) {
      return `El correo debe terminar en @${company?.slug}.com`;
    }
    return null;
  };

  return {
    // Data
    managers: filteredManagers,
    allManagers,
    metrics,
    isLoading,
    error,

    // Filters
    filters,
    updateSearch,
    updateBranch,
    updateStatus,
    clearFilters,

    // Operations
    createManager,
    updateManager,
    deleteManager,
    toggleManagerStatus,
    assignBranch,
    removeBranch,

    // Validation
    validateCreateManagerData,
    validateUpdateManagerData,

    // Utilities
    refresh,
  };
}
