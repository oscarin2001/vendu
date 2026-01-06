"use client";

import { toast } from "sonner";
import { assignManagerToBranch } from "../../../mutations/assignments/assign/assign-manager-to-branch";
import { removeManagerFromBranch } from "../../../mutations/assignments/remove/remove-manager-from-branch";

/**
 * Hook for branch manager assignment operations
 * Handles assign and remove manager operations
 */
export function useBranchAssignments(
  tenantId: string,
  onBranchChange?: () => void
) {
  const handleAssignManager = async (branchId: number, employeeId: number) => {
    try {
      await assignManagerToBranch(branchId, employeeId);
      toast.success("Gerente asignado exitosamente");
      onBranchChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error asignando gerente";
      toast.error(message);
      throw error;
    }
  };

  const handleRemoveManager = async (branchId: number, employeeId: number) => {
    try {
      await removeManagerFromBranch(branchId, employeeId);
      toast.success("Gerente removido exitosamente");
      onBranchChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error removiendo gerente";
      toast.error(message);
      throw error;
    }
  };

  return {
    assignManager: handleAssignManager,
    removeManager: handleRemoveManager,
  };
}
