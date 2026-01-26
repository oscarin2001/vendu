"use client";

import { toast } from "sonner";
import { Warehouse } from "../../types/warehouse.types";
import { createWarehouse } from "../../mutations/create";
import { updateWarehouse } from "../../mutations/update";
import { deleteWarehouse } from "../../mutations/delete";
import {
  assignManagerToWarehouse,
  removeManagerFromWarehouse,
} from "../../mutations/assign-manager";
import {
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "../../mutations/assign-branch";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Hook for warehouse CRUD operations
 * Handles create, update, delete operations with proper error handling and UI feedback
 */
export function useWarehouseOperations(
  tenantId: string,
  onWarehouseChange?: () => void
) {
  const handleCreateWarehouse = async (
    data: Parameters<typeof createWarehouse>[1],
    context?: UserContext
  ) => {
    try {
      const result = await createWarehouse(tenantId, data, context);
      toast.success("Bodega creada exitosamente");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create warehouse";
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateWarehouse = async (
    warehouseId: number,
    data: Parameters<typeof updateWarehouse>[2],
    context?: UserContext
  ) => {
    try {
      const result = await updateWarehouse(
        tenantId,
        warehouseId,
        data,
        context
      );
      toast.success("Bodega actualizada exitosamente");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update warehouse";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteWarehouse = async (
    warehouseId: number,
    password: string,
    context?: UserContext
  ) => {
    try {
      await deleteWarehouse(tenantId, warehouseId, password, context);
      toast.success("Bodega eliminada exitosamente");
      onWarehouseChange?.();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar la bodega";

      // Mostrar mensaje específico para asignaciones activas
      if (message.includes("asignaciones activas")) {
        toast.error(
          "No se puede eliminar la bodega porque tiene asignaciones activas. Remueva primero todos los gerentes y sucursales asignadas desde 'Gestionar Bodega'."
        );
      } else {
        toast.error(message);
      }
      throw error;
    }
  };

  const handleAssignManager = async (
    warehouseId: number,
    managerId: number,
    context?: UserContext
  ) => {
    try {
      const result = await assignManagerToWarehouse(
        tenantId,
        warehouseId,
        managerId,
        context
      );
      toast.success("Encargado asignado exitosamente");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to assign manager";
      toast.error(message);
      throw error;
    }
  };

  const handleRemoveManager = async (
    warehouseId: number,
    managerId: number,
    context?: UserContext
  ) => {
    try {
      const result = await removeManagerFromWarehouse(
        tenantId,
        warehouseId,
        managerId,
        context
      );
      toast.success("Encargado removido exitosamente");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove manager";
      toast.error(message);
      throw error;
    }
  };

  const handleAssignBranch = async (
    warehouseId: number,
    branchId: number,
    isPrimary: boolean = false,
    context?: UserContext
  ) => {
    try {
      const result = await assignWarehouseToBranch(
        tenantId,
        warehouseId,
        branchId,
        isPrimary,
        context
      );
      toast.success("Bodega asignada a la sucursal exitosamente");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign warehouse to branch";
      toast.error(message);
      throw error;
    }
  };

  const handleRemoveBranch = async (
    warehouseId: number,
    branchId: number,
    context?: UserContext
  ) => {
    try {
      const result = await removeWarehouseFromBranch(
        tenantId,
        warehouseId,
        branchId,
        context
      );
      toast.success("Warehouse removed from branch successfully");
      onWarehouseChange?.();
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove warehouse from branch";
      toast.error(message);
      throw error;
    }
  };

  return {
    createWarehouse: handleCreateWarehouse,
    updateWarehouse: handleUpdateWarehouse,
    deleteWarehouse: handleDeleteWarehouse,
    assignManager: handleAssignManager,
    removeManager: handleRemoveManager,
    assignBranch: handleAssignBranch,
    removeBranch: handleRemoveBranch,
  };
}
