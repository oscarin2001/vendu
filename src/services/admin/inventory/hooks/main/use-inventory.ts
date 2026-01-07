"use client";

import { useInventoryDataLoader } from "../data";

export function useInventory(tenantId: string) {
  const {
    inventoryData,
    metrics,
    productPerformance,
    conditions,
    isLoading,
    error,
    refetch,
  } = useInventoryDataLoader(tenantId);

  return {
    inventoryData,
    metrics,
    productPerformance,
    conditions,
    isLoading,
    error,
    refetch,
  };
}
