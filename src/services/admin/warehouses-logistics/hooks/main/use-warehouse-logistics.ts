"use client";

import { useWarehouseLogisticsDataLoader } from "../data";

export function useWarehouseLogistics(tenantId: string) {
  const {
    metrics,
    warehouses,
    movements,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  } = useWarehouseLogisticsDataLoader(tenantId);

  return {
    metrics,
    warehouses,
    movements,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  };
}
