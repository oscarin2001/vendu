"use client";

import { useState, useEffect } from "react";
import { getWarehousesByCompany, getWarehouseById } from "../../queries";
import type { WarehouseWithRelations } from "@/services/admin/warehouses/types/entities/warehouse";

/**
 * Hook for managing warehouse data state
 * @param tenantId - Company/tenant identifier
 * @returns Warehouse data state and operations
 */
export function useWarehouseData(tenantId: string) {
  const [warehouses, setWarehouses] = useState<WarehouseWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all warehouses for the company
   */
  const loadWarehouses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWarehousesByCompany(tenantId);
      setWarehouses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load warehouses"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load a specific warehouse by ID
   */
  const loadWarehouse = async (warehouseId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWarehouseById(tenantId, warehouseId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load warehouse");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a warehouse to the local state
   */
  const addWarehouse = (warehouse: WarehouseWithRelations) => {
    setWarehouses((prev) => [...prev, warehouse]);
  };

  /**
   * Update a warehouse in the local state
   */
  const updateWarehouse = (
    warehouseId: number,
    updates: Partial<WarehouseWithRelations>
  ) => {
    setWarehouses((prev) =>
      prev.map((warehouse) =>
        warehouse.id === warehouseId ? { ...warehouse, ...updates } : warehouse
      )
    );
  };

  /**
   * Remove a warehouse from the local state
   */
  const removeWarehouse = (warehouseId: number) => {
    setWarehouses((prev) =>
      prev.filter((warehouse) => warehouse.id !== warehouseId)
    );
  };

  // Load warehouses on mount
  useEffect(() => {
    if (tenantId) {
      loadWarehouses();
    }
  }, [tenantId]);

  return {
    warehouses,
    isLoading,
    error,
    loadWarehouses,
    loadWarehouse,
    addWarehouse,
    updateWarehouse,
    removeWarehouse,
  };
}
