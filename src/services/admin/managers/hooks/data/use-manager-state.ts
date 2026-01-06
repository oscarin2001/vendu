"use client";

import { useState, useEffect } from "react";
import { Manager, ManagerMetrics } from "../../types/manager.types";
import { getManagersByCompany } from "../../queries/list/get-managers";

/**
 * Hook for managing manager state
 * Handles loading, data storage, and basic state operations
 */
export function useManagerState(tenantId: string) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load managers data
  const loadManagers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const managersData = await getManagersByCompany(tenantId);
      setManagers(managersData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading managers";
      setError(errorMessage);
      console.error("Error loading managers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when tenantId changes
  useEffect(() => {
    loadManagers();
  }, [tenantId]);

  // Computed metrics
  const metrics: ManagerMetrics = {
    total: managers.length,
    active: managers.filter((m) => m.status === "ACTIVE").length,
    deactivated: managers.filter((m) => m.status === "DEACTIVATED").length,
    inactive: managers.filter((m) => m.status === "INACTIVE").length,
    withBranch: managers.filter((m) => m.branches && m.branches.length > 0)
      .length,
    withoutBranch: managers.filter(
      (m) => !m.branches || m.branches.length === 0
    ).length,
  };

  return {
    managers,
    setManagers,
    metrics,
    isLoading,
    error,
    refresh: loadManagers,
  };
}
