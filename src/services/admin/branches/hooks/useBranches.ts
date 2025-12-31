"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Branch,
  BranchMetrics,
  BranchFiltersState,
} from "../types/branch.types";
import {
  getBranchesByCompany,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/admin/branches/services/branch-service";
import { getManagersByCompany } from "@/services/admin/managers/services/manager-service";
import { validateAdminPassword } from "@/services/admin/managers/services/mutations/manager-mutations";
import { toast } from "sonner";

export function useBranches(tenantId: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<BranchFiltersState>({
    search: "",
    type: "all",
    status: "all",
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [branchesData, managersData] = await Promise.all([
        getBranchesByCompany(tenantId),
        getManagersByCompany(tenantId),
      ]);

      setBranches(branchesData);
      setManagers(
        managersData.map((m: any) => ({
          id: m.id,
          name: m.fullName,
        }))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Computed filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.address.toLowerCase().includes(searchTerm) ||
          branch.city.toLowerCase().includes(searchTerm) ||
          branch.manager?.name.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type === "stores" && branch.isWarehouse) return false;
      if (filters.type === "warehouses" && !branch.isWarehouse) return false;

      // Status filter (assuming all branches are active for now)
      // TODO: Add status field to branch model
      if (filters.status !== "all") return false;

      return true;
    });
  }, [branches, filters]);

  // Computed metrics
  const metrics: BranchMetrics = useMemo(() => {
    const total = branches.length;
    const stores = branches.filter((b) => !b.isWarehouse).length;
    const warehouses = branches.filter((b) => b.isWarehouse).length;
    const withManager = branches.filter(
      (b) => b.managers && b.managers.length > 0
    ).length;
    const withoutManager = total - withManager;

    return { total, stores, warehouses, withManager, withoutManager };
  }, [branches]);

  // CRUD operations
  const handleCreateBranch = async (data: any) => {
    try {
      await createBranch(tenantId, data);
      await loadData();
      toast.success("Sucursal creada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creando sucursal";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleUpdateBranch = async (branchId: number, data: any) => {
    try {
      await updateBranch(branchId, data);
      await loadData();
      toast.success("Sucursal actualizada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error actualizando sucursal";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteBranch = async (
    branchId: number,
    adminPassword: string
  ) => {
    try {
      // Validar contraseña del administrador primero
      await validateAdminPassword(tenantId, "", adminPassword);

      // Si la validación pasa, proceder con la eliminación
      await deleteBranch(branchId);
      await loadData();
      toast.success("Sucursal eliminada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error eliminando sucursal";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    branches: filteredBranches,
    allBranches: branches,
    managers,
    metrics,
    isLoading,
    error,
    filters,
    setFilters,
    createBranch: handleCreateBranch,
    updateBranch: handleUpdateBranch,
    deleteBranch: handleDeleteBranch,
    reloadBranches: loadData,
  };
}
