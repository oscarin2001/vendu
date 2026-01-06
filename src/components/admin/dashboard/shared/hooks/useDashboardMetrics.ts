"use client";

import { useState, useEffect } from "react";
import { DashboardMetrics } from "../types";

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalBranches: 0,
    totalSales: 0,
    totalInventory: 0,
    activeUsers: 0,
    totalManagers: 0,
    totalSuppliers: 0,
    totalWarehouses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMetrics = async () => {
      try {
        // Simulated API call - replace with real service
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - replace with real data
        setMetrics({
          totalUsers: 1250,
          totalBranches: 8,
          totalSales: 456780,
          totalInventory: 15420,
          activeUsers: 1180,
          totalManagers: 12,
          totalSuppliers: 45,
          totalWarehouses: 3,
        });
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, isLoading };
}
