"use client";

import { toast } from "sonner";
import { UserContext } from "../../../types/context/user-context.types";
import {
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../../mutations/crud";

/**
 * Hook for branch CRUD operations
 * Handles create, update, delete operations with proper error handling and UI feedback
 */
export function useBranchCrud(tenantId: string, onBranchChange?: () => void) {
  const handleCreateBranch = async (
    data: Parameters<typeof createBranch>[1],
    context?: UserContext
  ) => {
    try {
      const result = await createBranch(tenantId, data, context);
      toast.success("Sucursal creada exitosamente");
      onBranchChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creando sucursal";
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateBranch = async (
    branchId: number,
    data: Parameters<typeof updateBranch>[2],
    context?: UserContext
  ) => {
    try {
      const result = await updateBranch(tenantId, branchId, data, context);
      toast.success("Sucursal actualizada exitosamente");
      onBranchChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error actualizando sucursal";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteBranch = async (
    branchId: number,
    password: string,
    context?: UserContext
  ) => {
    try {
      await deleteBranch(tenantId, branchId, password, context);
      toast.success("Sucursal eliminada exitosamente");
      onBranchChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error eliminando sucursal";
      toast.error(message);
      throw error;
    }
  };

  return {
    createBranch: handleCreateBranch,
    updateBranch: handleUpdateBranch,
    deleteBranch: handleDeleteBranch,
  };
}
