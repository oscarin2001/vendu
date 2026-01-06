"use client";

import { useWarehouseState } from "./use-warehouse-state";
import { useWarehouseFilters } from "./use-warehouse-filters";
import { useWarehouseMetrics } from "./use-warehouse-metrics";
import { useWarehouseOperations } from "./use-warehouse-operations";

/**
 * Main warehouse management hook
 * Combines all warehouse-related functionality into a single interface
 *
 * @param tenantId - The company/tenant identifier
 * @returns Complete warehouse management interface
 */
export function useWarehouses(tenantId: string) {
  // Core state management
  const {
    warehouses,
    isLoading,
    error,
    loadWarehouses,
    addWarehouse,
    updateWarehouse: updateWarehouseState,
    removeWarehouse,
  } = useWarehouseState(tenantId);

  // Filtering and search
  const {
    filters,
    filteredWarehouses,
    updateSearch,
    updateStatus,
    clearFilters,
  } = useWarehouseFilters(warehouses);

  // Metrics and statistics
  const { metrics, getStatusDistribution, getBranchUtilization } =
    useWarehouseMetrics(warehouses);

  // CRUD operations
  const operations = useWarehouseOperations(tenantId, loadWarehouses);

  return {
    // State
    warehouses: filteredWarehouses,
    allWarehouses: warehouses,
    isLoading,
    error,

    // Filters
    filters,
    updateSearch,
    updateStatus,
    clearFilters,

    // Metrics
    metrics,
    getStatusDistribution,
    getBranchUtilization,

    // Operations
    ...operations,

    // Utilities
    refresh: loadWarehouses,
  };
}
