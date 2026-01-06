"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getWarehousesByCompany } from "@/services/admin/warehouses";
import {
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "@/services/admin/warehouses";
import { getManagersByCompany } from "@/services/admin/managers";
import { useBranchAssignments } from "@/services/admin/branches/hooks/actions/assignments/use-branch-assignments";
import { Branch } from "@/services/admin/branches";

interface Warehouse {
  id: number;
  name: string;
  address: string;
  isPrimary?: boolean;
  isAssigned?: boolean;
}

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAssigned?: boolean;
}

interface UseBranchServiceConfigProps {
  branch: Branch | null;
  tenantId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useBranchServiceConfig({
  branch,
  tenantId,
  onClose,
  onSuccess,
}: UseBranchServiceConfigProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const { assignManager, removeManager } = useBranchAssignments(
    tenantId,
    () => {
      loadData();
      onSuccess?.();
    }
  );

  useEffect(() => {
    if (branch) {
      loadData();
    }
  }, [branch?.id, tenantId]);

  const loadData = async () => {
    if (!branch) return;

    setIsLoading(true);
    try {
      // Load warehouses
      const warehousesData = await getWarehousesByCompany(tenantId);
      const warehousesWithAssignment = warehousesData.map((warehouse: any) => {
        const assignedBranch = warehouse.branches?.find(
          (wb: any) => wb.id === branch.id
        );
        return {
          ...warehouse,
          isPrimary: assignedBranch?.isPrimary || false,
          isAssigned: !!assignedBranch,
        };
      });
      setWarehouses(warehousesWithAssignment);

      // Load managers
      const managersData = await getManagersByCompany(tenantId);
      const managersWithAssignment = managersData.map((manager: any) => ({
        ...manager,
        isAssigned:
          manager.branches?.some((b: any) => b.id === branch.id) || false,
      }));
      setManagers(managersWithAssignment);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  const assignWarehouseFunc = async (
    warehouseId: number,
    isPrimary: boolean
  ) => {
    if (!branch) return;

    setIsAssigning(true);
    try {
      await assignWarehouseToBranch(
        tenantId,
        warehouseId,
        branch.id,
        isPrimary
      );
      toast.success(
        isPrimary
          ? "Bodega designada como principal exitosamente"
          : "Bodega agregada como secundaria exitosamente"
      );
      await loadData();
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning warehouse:", error);
      toast.error("Error al asignar bodega");
    } finally {
      setIsAssigning(false);
    }
  };

  const removeWarehouseFunc = async (warehouseId: number) => {
    if (!branch) return;

    setIsAssigning(true);
    try {
      await removeWarehouseFromBranch(tenantId, warehouseId, branch.id);
      toast.success("Servicio de bodega removido exitosamente");
      await loadData();
      onSuccess?.();
    } catch (error) {
      console.error("Error removing warehouse:", error);
      toast.error("Error al remover el servicio de bodega");
    } finally {
      setIsAssigning(false);
    }
  };

  const assignManagerFunc = async (managerId: number) => {
    if (!branch) return;

    setIsAssigning(true);
    try {
      await assignManager(branch.id, managerId);
      await loadData();
      onSuccess?.(); // Refresh the branches list
    } catch (error) {
      console.error("Error assigning manager:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const removeManagerFunc = async () => {
    if (!branch || !assignedManager) return;

    setIsAssigning(true);
    try {
      await removeManager(branch.id, assignedManager.id);
      await loadData();
      onSuccess?.(); // Refresh the branches list
    } catch (error) {
      console.error("Error removing manager:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const assignedWarehouses = warehouses.filter((w) => w.isAssigned);
  const availableWarehouses = warehouses.filter((w) => !w.isAssigned);

  // Use the manager from the branch object if it exists
  const assignedManager = branch?.manager
    ? {
        id: branch.manager.id,
        firstName: branch.manager.name.split(" ")[0] || "",
        lastName: branch.manager.name.split(" ").slice(1).join(" ") || "",
        email: branch.manager.email,
        isAssigned: true,
      }
    : null;

  const availableManagers = managers.filter((m) => !m.isAssigned);

  return {
    warehouses,
    assignedWarehouses,
    availableWarehouses,
    assignedManager,
    availableManagers,
    isLoading,
    isAssigning,
    assignWarehouse: assignWarehouseFunc,
    removeWarehouse: removeWarehouseFunc,
    assignManager: assignManagerFunc,
    removeManager: removeManagerFunc,
  };
}
