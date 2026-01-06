"use client";

import { toast } from "sonner";
import { assignBranchToManager } from "../../../mutations/assignments/assign/assign-branch-to-manager";
import { removeBranchFromManager } from "../../../mutations/assignments/remove/remove-branch-from-manager";

/**
 * Hook for manager branch assignment operations
 * Handles assign and remove branch operations
 */
export function useManagerAssignments(
  tenantId: string,
  onManagerChange?: () => void
) {
  const handleAssignBranch = async (managerId: number, branchId: number) => {
    try {
      await assignBranchToManager(tenantId, managerId, branchId);
      toast.success("Sucursal asignada exitosamente");
      onManagerChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error asignando sucursal";
      toast.error(message);
      throw error;
    }
  };

  const handleRemoveBranch = async (managerId: number, branchId: number) => {
    try {
      await removeBranchFromManager(tenantId, managerId, branchId);
      toast.success("Sucursal removida exitosamente");
      onManagerChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error removiendo sucursal";
      toast.error(message);
      throw error;
    }
  };

  return {
    assignBranch: handleAssignBranch,
    removeBranch: handleRemoveBranch,
  };
}
