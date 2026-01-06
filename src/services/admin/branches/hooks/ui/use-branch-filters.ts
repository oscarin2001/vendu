"use client";

import { useState, useMemo } from "react";
import { Branch } from "../../types/entities/branch.types";
import { BranchFiltersState } from "../../types/ui/branch-ui.types";

/**
 * Hook for managing branch filters
 * Handles search and status filtering logic
 */
export function useBranchFilters(branches: Branch[]) {
  const [filters, setFilters] = useState<BranchFiltersState>({
    search: "",
    status: "all",
  });

  // Update search filter
  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  // Update status filter
  const updateStatus = (status: "all" | "withManager" | "withoutManager") => {
    setFilters((prev) => ({ ...prev, status }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  // Filtered branches based on current filters
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.address.toLowerCase().includes(searchTerm) ||
          branch.city.toLowerCase().includes(searchTerm) ||
          branch.manager?.name.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status === "withManager") {
        return branch.manager !== null;
      }
      if (filters.status === "withoutManager") {
        return branch.manager === null;
      }

      return true;
    });
  }, [branches, filters]);

  return {
    filters,
    filteredBranches,
    updateSearch,
    updateStatus,
    clearFilters,
  };
}
