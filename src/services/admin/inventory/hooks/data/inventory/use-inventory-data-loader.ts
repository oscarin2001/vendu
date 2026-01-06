"use client";

import { useEffect, useState } from "react";
import type { InventoryData, InventoryMetrics, ProductPerformance } from "../../types";

export function useInventoryDataLoader(tenantId: string) {
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      loadInventoryData();
    }
  }, [tenantId]);

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement actual API calls
      // const inventory = await getInventoryByTenant(tenantId);
      // const calculatedMetrics = await getInventoryMetrics(tenantId);
      // const performance = await getProductPerformance(tenantId);

      // Mock data for now
      const mockInventory: InventoryData[] = [];
      const mockMetrics: InventoryMetrics = {
        totalItems: 0,
        totalValue: 0,
        stockByBranch: [],
        stockByWarehouse: [],
        stockByCondition: {
          excellent: 0,
          good: 0,
          acceptable: 0,
          damaged: 0,
        },
      };
      const mockPerformance: ProductPerformance[] = [];

      setInventoryData(mockInventory);
      setMetrics(mockMetrics);
      setProductPerformance(mockPerformance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inventoryData,
    metrics,
    productPerformance,
    isLoading,
    error,
    refetch: loadInventoryData,
  };
}