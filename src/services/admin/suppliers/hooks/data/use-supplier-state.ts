"use client";

import { useState, useEffect, useMemo } from "react";
import { querySuppliersByCompany } from "../../queries/suppliers";
import { getManagersByCompany } from "@/services/admin/managers";
import { toast } from "sonner";
import type { Supplier } from "../../types/entities/supplier";
import type { SupplierMetrics } from "../../types/entities/supplier-metrics";

/**
 * Hook for managing supplier state and metrics
 */
export function useSupplierState(tenantId: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [suppliersData, managersData] = await Promise.all([
        querySuppliersByCompany(tenantId),
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

  // Computed metrics
  const metrics: SupplierMetrics = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.isActive).length;
    const withManagers = suppliers.filter((s) => s.managers.length > 0).length;
    const withoutManagers = total - withManagers;

    return { total, active, withManagers, withoutManagers };
  }, [suppliers]);

  return {
    suppliers,
    setSuppliers,
    managers,
    metrics,
    isLoading,
    error,
    refresh: loadData,
  };
}
