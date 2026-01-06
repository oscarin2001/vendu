"use client";

import { useState, useEffect } from "react";
import { Branch } from "../../types/entities/branch.types";
import { BranchMetrics } from "../../types/ui/branch-ui.types";
import { getBranchesByCompany } from "../../queries/data/get-branches";

/**
 * Hook for managing branch state
 * Handles loading, data storage, and basic state operations
 */
export function useBranchState(tenantId: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load branches data
  const loadBranches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const branchesData = await getBranchesByCompany(tenantId);

      setBranches(
        branchesData.map((branch: any) => ({
          ...branch,
          managers: branch.manager ? [branch.manager] : [],
          warehouses: branch.warehouses || [],
          suppliers: [], // TODO: Implement suppliers in getBranchesByCompany
        }))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading branches";
      setError(errorMessage);
      console.error("Error loading branches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when tenantId changes
  useEffect(() => {
    loadBranches();
  }, [tenantId]);

  // Computed metrics
  const metrics: BranchMetrics = {
    total: branches.length,
    stores: branches.length, // All branches are now stores
    warehouses: 0, // Warehouses are separate
    withManager: branches.filter((b) => b.managers && b.managers.length > 0)
      .length,
    withoutManager: branches.filter(
      (b) => !b.managers || b.managers.length === 0
    ).length,
  };

  return {
    branches,
    setBranches,
    metrics,
    isLoading,
    error,
    refresh: loadBranches,
  };
}
