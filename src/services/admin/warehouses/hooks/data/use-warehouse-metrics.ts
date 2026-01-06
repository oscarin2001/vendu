"use client";

import { useMemo } from "react";
import type { WarehouseWithRelations } from "@/services/admin/warehouses/types/entities/warehouse";
import type { WarehouseMetrics } from "@/services/admin/warehouses/types/entities/warehouse-metrics";
import type { WarehouseBranch } from "@/services/admin/warehouses/types/entities/warehouse";

/**
 * Hook for calculating warehouse metrics and statistics
 * @param warehouses - Array of warehouses to analyze
 * @returns Metrics and analysis functions
 */
export function useWarehouseMetrics(warehouses: WarehouseWithRelations[]) {
  /**
   * Calculate warehouse metrics
   */
  const metrics: WarehouseMetrics = useMemo(() => {
    const total = warehouses.length;
    const withManager = warehouses.filter((w) => w.managers.length > 0).length;
    const withoutManager = total - withManager;
    const totalBranches = warehouses.reduce(
      (sum, w) => sum + w.branches.length,
      0
    );

    // Calculate unassigned managers (this would need manager data from elsewhere)
    // For now, we'll set it to 0 as we don't have access to all managers
    const unassignedManagers = 0;

    return {
      total,
      withManager,
      withoutManager,
      totalBranches,
      unassignedManagers,
    };
  }, [warehouses]);

  /**
   * Get status distribution for charts
   */
  const getStatusDistribution = () => {
    return [
      { name: "With Manager", value: metrics.withManager, color: "#10b981" },
      {
        name: "Without Manager",
        value: metrics.withoutManager,
        color: "#f59e0b",
      },
    ];
  };

  /**
   * Get branch utilization data
   */
  const getBranchUtilization = () => {
    const utilization = warehouses.map((warehouse) => ({
      name: warehouse.name,
      branches: warehouse.branches.length,
      primaryBranches: warehouse.branches.filter(
        (b: WarehouseBranch) => b.isPrimary
      ).length,
    }));

    return utilization;
  };

  return {
    metrics,
    getStatusDistribution,
    getBranchUtilization,
  };
}
