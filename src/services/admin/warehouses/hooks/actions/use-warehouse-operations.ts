"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  createWarehouseForCompany,
  updateWarehouseForCompany,
  deleteWarehouseForCompany,
  assignManagerToWarehouse,
  removeManagerFromWarehouse,
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "../../mutations";
import type {
  CreateWarehouseData,
  UpdateWarehouseData,
} from "../../validations/types/warehouse-validation-types";

interface UserContext {
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Hook for warehouse CRUD operations
 * @param tenantId - Company/tenant identifier
 * @param onSuccess - Callback for successful operations
 * @returns Operation functions
 */
export function useWarehouseOperations(
  tenantId: string,
  onSuccess?: () => void
) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Create a new warehouse
   */
  const createWarehouse = async (
    data: CreateWarehouseData,
    context?: UserContext
  ) => {
    setIsCreating(true);
    try {
      await createWarehouseForCompany(tenantId, data, context);
      toast.success("Warehouse created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create warehouse"
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Update an existing warehouse
   */
  const updateWarehouse = async (
    warehouseId: number,
    data: UpdateWarehouseData,
    context?: UserContext
  ) => {
    setIsUpdating(true);
    try {
      await updateWarehouseForCompany(tenantId, warehouseId, data, context);
      toast.success("Warehouse updated successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update warehouse"
      );
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Delete a warehouse
   */
  const deleteWarehouse = async (
    warehouseId: number,
    password: string,
    context?: UserContext
  ) => {
    setIsDeleting(true);
    try {
      // Note: Password validation would be handled at a higher level
      await deleteWarehouseForCompany(tenantId, warehouseId, context);
      toast.success("Warehouse deleted successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete warehouse"
      );
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Assign manager to warehouse
   */
  const assignManager = async (
    warehouseId: number,
    managerId: number,
    context?: UserContext
  ) => {
    try {
      await assignManagerToWarehouse(tenantId, warehouseId, managerId, context);
      toast.success("Manager assigned successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign manager"
      );
      throw error;
    }
  };

  /**
   * Remove manager from warehouse
   */
  const removeManager = async (
    warehouseId: number,
    managerId: number,
    context?: UserContext
  ) => {
    try {
      await removeManagerFromWarehouse(
        tenantId,
        warehouseId,
        managerId,
        context
      );
      toast.success("Manager removed successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove manager"
      );
      throw error;
    }
  };

  /**
   * Assign warehouse to branch
   */
  const assignToBranch = async (
    warehouseId: number,
    branchId: number,
    isPrimary: boolean = false,
    context?: UserContext
  ) => {
    try {
      await assignWarehouseToBranch(
        tenantId,
        warehouseId,
        branchId,
        isPrimary,
        context
      );
      toast.success("Warehouse assigned to branch successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to assign warehouse to branch"
      );
      throw error;
    }
  };

  /**
   * Remove warehouse from branch
   */
  const removeFromBranch = async (
    warehouseId: number,
    branchId: number,
    context?: UserContext
  ) => {
    try {
      await removeWarehouseFromBranch(tenantId, warehouseId, branchId, context);
      toast.success("Warehouse removed from branch successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove warehouse from branch"
      );
      throw error;
    }
  };

  return {
    isCreating,
    isUpdating,
    isDeleting,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    assignManager,
    removeManager,
    assignToBranch,
    removeFromBranch,
  };
}
