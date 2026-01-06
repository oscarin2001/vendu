"use client";

import { useMemo } from "react";
import { Warehouse, WarehouseMetrics } from "../../types/warehouse.types";

/**
 * Hook for calculating warehouse metrics and statistics
 */
export function useWarehouseMetrics(warehouses: Warehouse[]) {
  const metrics: WarehouseMetrics = useMemo(() => {
    const total = warehouses.length;
    const withManager = warehouses.filter((w) => w.managers.length > 0).length;
    const withoutManager = total - withManager;
    const totalBranches = warehouses.reduce(
      (sum, w) => sum + w.branches.length,
      0
    );
    const unassignedManagers = warehouses
      .flatMap((w) => w.managers)
      .filter(
        (manager, index, arr) =>
          arr.findIndex((m) => m.id === manager.id) === index
      ).length;

    return {
      total,
      withManager,
      withoutManager,
      totalBranches,
      unassignedManagers,
    };
  }, [warehouses]);

  const getStatusDistribution = () => ({
    withManager: metrics.withManager,
    withoutManager: metrics.withoutManager,
    total: metrics.total,
  });

  const getBranchUtilization = () => ({
    totalBranches: metrics.totalBranches,
    averageBranchesPerWarehouse:
      metrics.total > 0
        ? Math.round((metrics.totalBranches / metrics.total) * 100) / 100
        : 0,
  });

  return {
    metrics,
    getStatusDistribution,
    getBranchUtilization,
  };
}
