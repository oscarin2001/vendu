"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getSuppliersByCompany,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/admin/suppliers/services/supplier-service";
import { getManagersByCompany } from "@/services/admin/managers/services/manager-service";
import { toast } from "sonner";
import type {
  Supplier,
  SupplierMetrics,
  SupplierFiltersState,
  CreateSupplierData,
  UpdateSupplierData,
} from "../types/supplier.types";

export function useSuppliers(tenantId: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SupplierFiltersState>({
    search: "",
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

      const [suppliersData, managersData] = await Promise.all([
        getSuppliersByCompany(tenantId),
        getManagersByCompany(tenantId),
      ]);

      setSuppliers(suppliersData);
      setManagers(
        managersData.map((m: any) => ({
          id: m.id,
          name: m.fullName,
        }))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading suppliers";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          supplier.fullName.toLowerCase().includes(searchTerm) ||
          supplier.supplierNumber.toLowerCase().includes(searchTerm) ||
          supplier.email?.toLowerCase().includes(searchTerm) ||
          supplier.phone?.includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status === "active" && !supplier.isActive) return false;
      if (filters.status === "inactive" && supplier.isActive) return false;

      // Manager filter
      if (
        filters.managerId &&
        !supplier.managers.some((m) => m.id === filters.managerId)
      )
        return false;

      return true;
    });
  }, [suppliers, filters]);

  // Computed metrics
  const metrics: SupplierMetrics = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.isActive).length;
    const withManagers = suppliers.filter((s) => s.managers.length > 0).length;
    const withoutManagers = total - withManagers;

    return { total, active, withManagers, withoutManagers };
  }, [suppliers]);

  // CRUD operations
  const handleCreateSupplier = async (data: CreateSupplierData) => {
    try {
      await createSupplier(tenantId, data);
      await loadData();
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
      await updateSupplier(supplierId, data);
      await loadData();
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
      await deleteSupplier(supplierId);
      await loadData();
      toast.success("Proveedor eliminado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error eliminando proveedor";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    suppliers: filteredSuppliers,
    allSuppliers: suppliers,
    managers,
    metrics,
    isLoading,
    error,
    filters,
    setFilters,
    createSupplier: handleCreateSupplier,
    updateSupplier: handleUpdateSupplier,
    deleteSupplier: handleDeleteSupplier,
    reloadSuppliers: loadData,
  };
}
