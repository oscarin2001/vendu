"use client";

import { useMemo } from "react";
import { WarehouseMetrics } from "@/services/admin/warehouses/types/warehouse.types";

interface UseWarehouseMetricsProps {
  total: number;
  withManager: number;
  withoutManager: number;
  totalBranches: number;
  unassignedManagers: number;
}

export function useWarehouseMetrics({
  total,
  withManager,
  withoutManager,
  totalBranches,
  unassignedManagers,
}: UseWarehouseMetricsProps): WarehouseMetrics {
  return useMemo(
    () => ({
      total,
      withManager,
      withoutManager,
      totalBranches,
      unassignedManagers,
    }),
    [total, withManager, withoutManager, totalBranches, unassignedManagers]
  );
}
