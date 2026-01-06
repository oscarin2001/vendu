"use client";

import { useState, useEffect } from "react";
import { ManagerMetrics } from "../types";

export function useManagerMetrics() {
  const [metrics, setMetrics] = useState<ManagerMetrics>({
    total: 0,
    active: 0,
    deactivated: 0,
    inactive: 0,
    withBranch: 0,
    withoutBranch: 0,
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
          total: 12,
          active: 10,
          deactivated: 1,
          inactive: 1,
          withBranch: 8,
          withoutBranch: 4,
        });
      } catch (error) {
        console.error("Error fetching manager metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, isLoading };
}
