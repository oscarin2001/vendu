"use client";

import { useState, useEffect } from "react";
import { SupplierMetrics } from "../types";

export function useSupplierMetrics() {
  const [metrics, setMetrics] = useState<SupplierMetrics>({
    total: 0,
    active: 0,
    withManagers: 0,
    withoutManagers: 0,
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
          total: 45,
          active: 38,
          withManagers: 32,
          withoutManagers: 13,
        });
      } catch (error) {
        console.error("Error fetching supplier metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, isLoading };
}
