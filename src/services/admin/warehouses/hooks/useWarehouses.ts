"use client";

import { useState, useEffect, useMemo } from "react";
import { Warehouse, WarehouseMetrics } from "../types/warehouse.types";
import {
  getWarehousesByCompany,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../warehouse-service";
import { getManagersByCompany } from "@/services/admin/managers/services/manager-service";
import { getBranchesByCompany } from "@/services/admin/branches/services/branch-service";
import { validateAdminPassword } from "@/services/admin/managers/services/mutations/manager-mutations";
import { toast } from "sonner";

export function useWarehouses(tenantId: string) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state - updated for new architecture
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

      const [warehousesData, managersData, branchesData] = await Promise.all([
        getWarehousesByCompany(tenantId),
        getManagersByCompany(tenantId),
        getBranchesByCompany(tenantId),
      ]);

      setWarehouses(warehousesData);
      setManagers(
        managersData.map((manager) => ({
          id: manager.id,
          name: manager.fullName,
        }))
      );
      setBranches(
        branchesData.map((branch) => ({
          id: branch.id,
          name: branch.name,
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load warehouses"
      );
      console.error("Error loading warehouses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered warehouses
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          warehouse.name.toLowerCase().includes(searchTerm) ||
          warehouse.address.toLowerCase().includes(searchTerm) ||
          warehouse.city.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status === "withManager") {
        return warehouse.managers.length > 0;
      }
      if (filters.status === "withoutManager") {
        return warehouse.managers.length === 0;
      }

      return true;
    });
  }, [warehouses, filters]);

  // Metrics
  const metrics: WarehouseMetrics = useMemo(() => {
    const total = warehouses.length;
    const withManager = warehouses.filter((w) => w.managers.length > 0).length;
    const withoutManager = total - withManager;
    const totalBranches = warehouses.reduce(
      (sum, w) => sum + w.branches.length,
      0
    );

    // Calculate unassigned managers
    const assignedManagerIds = new Set(
      warehouses.flatMap((w) => w.managers.map((m) => m.id))
    );
    const unassignedManagers = managers.filter(
      (m) => !assignedManagerIds.has(m.id)
    ).length;

    return {
      total,
      withManager,
      withoutManager,
      totalBranches,
      unassignedManagers,
    };
  }, [warehouses, managers]);

  // CRUD operations
  const handleCreateWarehouse = async (data: {
    name: string;
    phone?: string;
    address: string;
    city: string;
    department?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    try {
      const newWarehouse = await createWarehouse(tenantId, data);
      setWarehouses((prev) => [
        ...prev,
        {
          ...newWarehouse,
          managers: [],
          branches: [],
        },
      ]);
      toast.success("Warehouse created successfully");
      return newWarehouse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create warehouse";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleUpdateWarehouse = async (
    warehouseId: number,
    data: Partial<{
      name: string;
      phone?: string;
      address: string;
      city: string;
      department?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    }>
  ) => {
    try {
      const updatedWarehouse = await updateWarehouse(
        tenantId,
        warehouseId,
        data
      );
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === warehouseId
            ? {
                ...w,
                ...updatedWarehouse,
                updatedAt: updatedWarehouse.updatedAt || w.updatedAt,
              }
            : w
        )
      );
      toast.success("Warehouse updated successfully");
      return updatedWarehouse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update warehouse";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDeleteWarehouse = async (
    warehouseId: number,
    adminPassword: string
  ) => {
    try {
      // TODO: Implement admin password validation
      // await validateAdminPassword(tenantId, adminEmail, adminPassword);

      await deleteWarehouse(tenantId, warehouseId);
      setWarehouses((prev) => prev.filter((w) => w.id !== warehouseId));
      toast.success("Warehouse deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete warehouse";
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    warehouses: filteredWarehouses,
    allWarehouses: warehouses,
    managers,
    branches,
    metrics,
    isLoading,
    error,
    filters,
    setFilters,
    refreshData: loadData,
    createWarehouse: handleCreateWarehouse,
    updateWarehouse: handleUpdateWarehouse,
    deleteWarehouse: handleDeleteWarehouse,
  };
}
