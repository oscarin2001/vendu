"use client";

import { useBranchState } from "../../data/use-branch-state";
import { useBranchFilters } from "../../ui/use-branch-filters";
import { useBranchCrud } from "../../actions/crud/use-branch-crud";
import { useBranchAssignments } from "../../actions/assignments/use-branch-assignments";

/**
 * Main hook for branch management
 * Combines state, filters, and operations into a single interface
 */
export function useBranches(tenantId: string) {
  // State management
  const {
    branches: allBranches,
    setBranches,
    metrics,
    isLoading,
    error,
    refresh,
  } = useBranchState(tenantId);

  // Filtering logic
  const {
    filters,
    filteredBranches,
    updateSearch,
    updateStatus,
    clearFilters,
  } = useBranchFilters(allBranches);

  // Operations
  const { createBranch, updateBranch, deleteBranch } = useBranchCrud(
    tenantId,
    refresh
  );

  const { assignManager, removeManager } = useBranchAssignments(
    tenantId,
    refresh
  );

  return {
    // Data
    branches: filteredBranches,
    allBranches,
    metrics,
    isLoading,
    error,

    // Filters
    filters,
    updateSearch,
    updateStatus,
    clearFilters,

    // Operations
    createBranch,
    updateBranch,
    deleteBranch,
    assignManager,
    removeManager,

    // Utilities
    refresh,
  };
}
