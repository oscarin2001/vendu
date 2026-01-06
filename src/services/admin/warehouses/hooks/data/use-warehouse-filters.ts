"use client";

import { useState, useMemo } from "react";
import type { WarehouseWithRelations } from "@/services/admin/warehouses/types/entities/warehouse";
import type { WarehouseFilters } from "@/services/admin/warehouses/types/ui/warehouse-filters";

/**
 * Hook for managing warehouse filtering and search
 * @param warehouses - Array of warehouses to filter
 * @returns Filter state and filtered results
 */
export function useWarehouseFilters(warehouses: WarehouseWithRelations[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WarehouseFilters>("all");

  /**
   * Filtered warehouses based on search term and status filter
   */
  const filteredWarehouses = useMemo(() => {
    let filtered = warehouses;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (warehouse) =>
          warehouse.name.toLowerCase().includes(searchLower) ||
          warehouse.address.toLowerCase().includes(searchLower) ||
          warehouse.city.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    switch (statusFilter) {
      case "withManager":
        filtered = filtered.filter(
          (warehouse) => warehouse.managers.length > 0
        );
        break;
      case "withoutManager":
        filtered = filtered.filter(
          (warehouse) => warehouse.managers.length === 0
        );
        break;
      case "all":
      default:
        // No additional filtering
        break;
    }

    return filtered;
  }, [warehouses, searchTerm, statusFilter]);

  /**
   * Update search term
   */
  const updateSearch = (term: string) => {
    setSearchTerm(term);
  };

  /**
   * Update status filter
   */
  const updateStatus = (status: WarehouseFilters) => {
    setStatusFilter(status);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return {
    filters: {
      searchTerm,
      statusFilter,
    },
    filteredWarehouses,
    updateSearch,
    updateStatus,
    clearFilters,
  };
}
