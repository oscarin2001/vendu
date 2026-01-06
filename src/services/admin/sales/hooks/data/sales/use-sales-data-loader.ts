"use client";

import { useEffect, useState } from "react";
import type { SalesData, SalesMetrics } from "../../types";

export function useSalesDataLoader(tenantId: string) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      loadSalesData();
    }
  }, [tenantId]);

  const loadSalesData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement actual API calls
      // const sales = await getSalesByTenant(tenantId);
      // const calculatedMetrics = await getSalesMetrics(tenantId);

      // Mock data for now
      const mockSales: SalesData[] = [];
      const mockMetrics: SalesMetrics = {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        salesByDay: [],
        salesByBranch: [],
        salesByEmployee: [],
      };

      setSalesData(mockSales);
      setMetrics(mockMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading sales data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    salesData,
    metrics,
    isLoading,
    error,
    refetch: loadSalesData,
  };
}