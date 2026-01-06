"use client";

import { useState, useMemo } from "react";
import { Warehouse } from "../../types/warehouse.types";

export type WarehouseStatusFilter = "all" | "withManager" | "withoutManager";

export interface WarehouseFilters {
  search: string;
  status: WarehouseStatusFilter;
}

/**
 * Hook for managing warehouse filters and search functionality
 */
export function useWarehouseFilters(warehouses: Warehouse[]) {
  const [filters, setFilters] = useState<WarehouseFilters>({
    search: "",
    status: "all",
  });

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      // Search filter - case insensitive
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          warehouse.name.toLowerCase().includes(searchTerm) ||
          warehouse.address.toLowerCase().includes(searchTerm) ||
          warehouse.city.toLowerCase().includes(searchTerm) ||
          warehouse.managers.some((manager) =>
            manager.name.toLowerCase().includes(searchTerm)
          );

        if (!matchesSearch) return false;
      }

      // Status filter - manager assignment
      if (filters.status === "withManager") {
        return warehouse.managers.length > 0;
      }
      if (filters.status === "withoutManager") {
        return warehouse.managers.length === 0;
      }

      return true;
    });
  }, [warehouses, filters]);

  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const updateStatus = (status: WarehouseStatusFilter) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  return {
    filters,
    filteredWarehouses,
    updateSearch,
    updateStatus,
    clearFilters,
  };
}
