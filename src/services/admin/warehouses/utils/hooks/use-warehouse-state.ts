"use client";

import { useState, useEffect } from "react";
import { Warehouse } from "../../types/warehouse.types";
import { getWarehousesByCompany } from "../../queries/data/get-warehouses";

/**
 * Hook for managing warehouse data state
 * Handles loading, error states, and data fetching
 */
export function useWarehouseState(tenantId: string) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWarehouses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWarehousesByCompany(tenantId);
      setWarehouses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load warehouses"
      );
      console.error("Error loading warehouses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addWarehouse = (warehouse: Warehouse) => {
    setWarehouses((prev) => [...prev, warehouse]);
  };

  const updateWarehouse = (
    warehouseId: number,
    updates: Partial<Warehouse>
  ) => {
    setWarehouses((prev) =>
      prev.map((warehouse) =>
        warehouse.id === warehouseId ? { ...warehouse, ...updates } : warehouse
      )
    );
  };

  const removeWarehouse = (warehouseId: number) => {
    setWarehouses((prev) => prev.filter((w) => w.id !== warehouseId));
  };

  // Load data on mount and when tenantId changes
  useEffect(() => {
    loadWarehouses();
  }, [tenantId]);

  return {
    warehouses,
    isLoading,
    error,
    loadWarehouses,
    addWarehouse,
    updateWarehouse,
    removeWarehouse,
  };
}
