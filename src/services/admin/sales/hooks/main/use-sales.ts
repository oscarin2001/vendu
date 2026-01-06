"use client";

import { useSalesDataLoader } from "./data";

export function useSales(tenantId: string) {
  const {
    salesData,
    metrics,
    isLoading,
    error,
    refetch,
  } = useSalesDataLoader(tenantId);

  return {
    salesData,
    metrics,
    isLoading,
    error,
    refetch,
  };
}