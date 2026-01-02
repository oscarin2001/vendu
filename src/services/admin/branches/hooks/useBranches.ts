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
} from "../branch-service";
import { getManagersByCompany } from "@/services/admin/managers/services/manager-service";
import { getSuppliersByCompany } from "@/services/admin/suppliers/services/queries/supplier-queries";
import { validateAdminPassword } from "@/services/admin/managers/services/mutations/manager-mutations";
import { toast } from "sonner";

export function useBranches(tenantId: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state - simplified for stores only
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as "all" | "withManager" | "withoutManager",
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [branchesData, managersData, suppliersData] = await Promise.all([
        getBranchesByCompany(tenantId),
        getManagersByCompany(tenantId),
        getSuppliersByCompany(tenantId),
      ]);

      setBranches(
        branchesData.map((branch: any) => ({
          ...branch,
          managers: branch.manager ? [branch.manager] : [], // Convertir manager singular a array managers
          suppliers: [], // TODO: Implementar suppliers en getBranchesByCompany
        }))
      );
      setManagers(
        managersData.map((m: any) => ({
          id: m.id,
          name: m.fullName,
        }))
      );
      setSuppliers(
        suppliersData.map((s: any) => ({
          id: s.id,
          name: s.fullName,
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

      // Status filter
      if (filters.status === "withManager") {
        return branch.manager !== null;
      }
      if (filters.status === "withoutManager") {
        return branch.manager === null;
      }

      return true;
    });
  }, [branches, filters]);

  // Computed metrics
  const metrics: BranchMetrics = useMemo(() => {
    const total = branches.length;
    const stores = branches.length; // All branches are now stores
    const warehouses = 0; // Warehouses are separate
    const withManager = branches.filter(
      (b) => b.managers && b.managers.length > 0
    ).length;
    const withoutManager = total - withManager;

    return { total, stores, warehouses, withManager, withoutManager };
  }, [branches]);

  // CRUD operations
  const handleCreateBranch = async (data: any, userContext?: any) => {
    try {
      await createBranch(tenantId, data, userContext);
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

  const handleUpdateBranch = async (
    branchId: number,
    data: any,
    userContext?: any
  ) => {
    try {
      await updateBranch(branchId, data, userContext);
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
    adminPassword: string,
    userContext?: any
  ) => {
    try {
      // Validar contraseña del administrador primero
      await validateAdminPassword(tenantId, "", adminPassword);

      // Si la validación pasa, proceder con la eliminación
      await deleteBranch(branchId, userContext);
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
    suppliers,
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
