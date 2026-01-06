"use client";

import { useSupplierState } from "../data/use-supplier-state";
import { useSupplierFilters } from "../ui/use-supplier-filters";
import { useSupplierOperations } from "../actions/use-supplier-operations";

/**
 * Main hook for supplier management
 * Combines state, filters, and operations into a single interface
 */
export function useSuppliers(tenantId: string) {
  // State management
  const {
    suppliers: allSuppliers,
    setSuppliers,
    managers,
    metrics,
    isLoading,
    error,
    refresh,
  } = useSupplierState(tenantId);

  // Filtering logic
  const {
    filters,
    filteredSuppliers,
    updateSearch,
    updateStatus,
    updateManager,
    clearFilters,
  } = useSupplierFilters(allSuppliers);

  // CRUD operations
  const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    assignManager,
    removeManager,
  } = useSupplierOperations(tenantId, refresh);

  return {
    // Data
    suppliers: filteredSuppliers,
    allSuppliers,
    managers,
    metrics,
    isLoading,
    error,

    // Filters
    filters,
    updateSearch,
    updateStatus,
    updateManager,
    clearFilters,

    // Operations
    createSupplier,
    updateSupplier,
    deleteSupplier,
    assignManager,
    removeManager,

    // Utilities
    refresh,
  };
}
