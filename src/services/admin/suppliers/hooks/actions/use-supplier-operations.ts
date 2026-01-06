"use client";

import { mutateCreateSupplier } from "../../mutations/suppliers";
import { mutateUpdateSupplier } from "../../mutations/suppliers";
import { mutateDeleteSupplier } from "../../mutations/suppliers";
import { mutateAssignManagerToSupplier } from "../../mutations/suppliers";
import { mutateRemoveManagerFromSupplier } from "../../mutations/suppliers";
import { toast } from "sonner";
import type { CreateSupplierData } from "../../types/entities/create-supplier-data";
import type { UpdateSupplierData } from "../../types/entities/update-supplier-data";

/**
 * Hook for supplier CRUD operations
 */
export function useSupplierOperations(
  tenantId: string,
  refresh: () => Promise<void>
) {
  const handleCreateSupplier = async (data: CreateSupplierData) => {
    try {
      await mutateCreateSupplier(tenantId, data);
      await refresh();
      toast.success("Proveedor creado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creando proveedor";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleUpdateSupplier = async (
    supplierId: number,
    data: UpdateSupplierData
  ) => {
    try {
      await mutateUpdateSupplier(supplierId, data);
      await refresh();
      toast.success("Proveedor actualizado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error actualizando proveedor";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    try {
      await mutateDeleteSupplier(supplierId);
      await refresh();
      toast.success("Proveedor eliminado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error eliminando proveedor";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const assignManager = async (supplierId: number, managerId: number) => {
    try {
      await mutateAssignManagerToSupplier(tenantId, supplierId, managerId);
      await refresh();
      toast.success("Gerente asignado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error asignando gerente";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeManager = async (supplierId: number, managerId: number) => {
    try {
      await mutateRemoveManagerFromSupplier(tenantId, supplierId, managerId);
      await refresh();
      toast.success("Gerente removido exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error removiendo gerente";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    createSupplier: handleCreateSupplier,
    updateSupplier: handleUpdateSupplier,
    deleteSupplier: handleDeleteSupplier,
    assignManager,
    removeManager,
  };
}
