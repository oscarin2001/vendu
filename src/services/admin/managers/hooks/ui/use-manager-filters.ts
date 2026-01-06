"use client";

import { useState, useMemo } from "react";
import type { Manager, ManagerFiltersState } from "../../types/manager.types";

/**
 * Hook for managing manager filters
 * Handles search, branch, and status filtering logic
 */
export function useManagerFilters(managers: Manager[]) {
  const [filters, setFilters] = useState<ManagerFiltersState>({
    search: "",
    branch: "all",
    status: "all",
  });

  // Update search filter
  const updateSearch = (search: string) => {
    setFilters((prev: ManagerFiltersState) => ({ ...prev, search }));
  };

  // Update branch filter
  const updateBranch = (branch: string) => {
    setFilters((prev: ManagerFiltersState) => ({ ...prev, branch }));
  };

  // Update status filter
  const updateStatus = (
    status: "all" | "active" | "deactivated" | "inactive"
  ) => {
    setFilters((prev: ManagerFiltersState) => ({ ...prev, status }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      branch: "all",
      status: "all",
    });
  };

  // Filtered managers based on current filters
  const filteredManagers = useMemo(() => {
    return managers.filter((manager) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          manager.fullName.toLowerCase().includes(searchTerm) ||
          manager.email.toLowerCase().includes(searchTerm) ||
          manager.ci.includes(searchTerm) ||
          manager.branches.some((branch) =>
            branch.name.toLowerCase().includes(searchTerm)
          );

        if (!matchesSearch) return false;
      }

      // Branch filter
      if (filters.branch !== "all") {
        if (filters.branch === "none" && manager.branches.length > 0)
          return false;
        if (
          filters.branch !== "none" &&
          !manager.branches.some(
            (branch) => branch.id.toString() === filters.branch
          )
        )
          return false;
      }

      // Status filter
      if (filters.status !== "all") {
        if (filters.status === "active" && manager.status !== "ACTIVE")
          return false;
        if (
          filters.status === "deactivated" &&
          manager.status !== "DEACTIVATED"
        )
          return false;
        if (filters.status === "inactive" && manager.status !== "INACTIVE")
          return false;
      }

      return true;
    });
  }, [managers, filters]);

  return {
    filters,
    filteredManagers,
    updateSearch,
    updateBranch,
    updateStatus,
    clearFilters,
  };
}
