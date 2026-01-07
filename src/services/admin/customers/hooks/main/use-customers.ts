"use client";

import { useCustomersDataLoader } from "../data";

export function useCustomers(tenantId: string) {
  const {
    customerBehaviors,
    metrics,
    segments,
    reservations,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  } = useCustomersDataLoader(tenantId);

  return {
    customerBehaviors,
    metrics,
    segments,
    reservations,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  };
}
