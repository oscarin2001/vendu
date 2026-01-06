"use client";

import { useState, useMemo } from "react";
import type { Supplier } from "../../types/entities/supplier";
import type { SupplierFiltersState } from "../../types/ui/supplier-filters-state";

/**
 * Hook for managing supplier filters
 */
export function useSupplierFilters(
  suppliers: Supplier[],
  initialFilters?: Partial<SupplierFiltersState>
) {
  const [filters, setFilters] = useState<SupplierFiltersState>({
    search: "",
    status: "all",
    ...initialFilters,
  });

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          supplier.fullName.toLowerCase().includes(searchTerm) ||
          supplier.email?.toLowerCase().includes(searchTerm) ||
          supplier.phone?.includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status === "active" && !supplier.isActive) return false;
      if (filters.status === "inactive" && supplier.isActive) return false;

      // Manager filter
      if (
        filters.managerId &&
        !supplier.managers.some((m: any) => m.id === filters.managerId)
      )
        return false;

      return true;
    });
  }, [suppliers, filters]);

  const updateSearch = (search: string) => {
    setFilters((prev: SupplierFiltersState) => ({ ...prev, search }));
  };

  const updateStatus = (status: "all" | "active" | "inactive") => {
    setFilters((prev: SupplierFiltersState) => ({ ...prev, status }));
  };

  const updateManager = (managerId?: number) => {
    setFilters((prev: SupplierFiltersState) => ({ ...prev, managerId }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      managerId: undefined,
    });
  };

  return {
    filters,
    filteredSuppliers,
    updateSearch,
    updateStatus,
    updateManager,
    clearFilters,
  };
}
