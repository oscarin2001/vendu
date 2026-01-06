"use client";

import { useWarehouseState } from "@/services/admin/warehouses/hooks/ui/use-warehouse-state";
import { useWarehouseFilters } from "@/services/admin/warehouses/hooks/data/use-warehouse-filters";
import { useWarehouseMetrics } from "@/services/admin/warehouses/hooks/data/use-warehouse-metrics";
import { useWarehouseOperations } from "@/services/admin/warehouses/hooks/actions/use-warehouse-operations";

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
    selectedWarehouse,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
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

    // Modal state
    selectedWarehouse,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

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

    // Modal actions
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,

    // Utilities
    refresh: loadWarehouses,
  };
}
