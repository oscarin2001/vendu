"use client";

import { toast } from "sonner";
import { Manager } from "../../types/manager.types";
import type { UserContext } from "../../types/manager.types";
import {
  createManager,
  updateManager,
  deleteManager,
  toggleManagerStatus,
} from "../../mutations/crud";
import {
  assignBranchToManager,
  removeBranchFromManager,
} from "../../mutations/assignments/assign-branch";

/**
 * Hook for manager CRUD operations
 * Handles create, update, delete operations with proper error handling and UI feedback
 */
export function useManagerOperations(
  tenantId: string,
  onManagerChange?: () => void
) {
  const handleCreateManager = async (
    data: Parameters<typeof createManager>[1],
    context?: UserContext
  ) => {
    try {
      const result = await createManager(tenantId, data, context);
      toast.success("Encargado creado exitosamente");
      onManagerChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creando encargado";
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateManager = async (
    managerId: number,
    data: Parameters<typeof updateManager>[2],
    context?: UserContext
  ) => {
    try {
      const result = await updateManager(tenantId, managerId, data, context);
      toast.success("Encargado actualizado exitosamente");
      onManagerChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error actualizando encargado";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteManager = async (
    managerId: number,
    password: string,
    context?: UserContext
  ) => {
    try {
      await deleteManager(tenantId, managerId, password, context);
      toast.success("Encargado eliminado exitosamente");
      onManagerChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error eliminando encargado";
      toast.error(message);
      throw error;
    }
  };

  const handleToggleManagerStatus = async (
    managerId: number,
    context?: UserContext
  ) => {
    try {
      const result = await toggleManagerStatus(tenantId, managerId, context);
      const newStatusText =
        result.newStatus === "ACTIVE" ? "activado" : "desactivado";
      toast.success(`Encargado ${newStatusText} exitosamente`);
      onManagerChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error cambiando estado del encargado";
      toast.error(message);
      throw error;
    }
  };

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
    createManager: handleCreateManager,
    updateManager: handleUpdateManager,
    deleteManager: handleDeleteManager,
    toggleManagerStatus: handleToggleManagerStatus,
    assignBranch: handleAssignBranch,
    removeBranch: handleRemoveBranch,
  };
}
