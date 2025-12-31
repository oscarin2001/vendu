"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getManagersByCompany,
  createManager,
  updateManager,
  deleteManager,
} from "@/services/admin/managers/services/manager-service";
import { validateAdminPassword } from "@/services/admin/managers/services/mutations/manager-mutations";
import { useCompany } from "@/services/admin/company/hooks/useCompany";
import { toast } from "sonner";
import type {
  Manager,
  ManagerMetrics,
  ManagerFilters,
  CreateManagerData,
  UpdateManagerData,
} from "../types/manager.types";

export function useManagers(tenantId: string) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ManagerFilters>({
    search: "",
    branch: "all",
    status: "all",
  });

  // Get company data for email domain validation
  const { company } = useCompany(tenantId);

  // Load managers
  useEffect(() => {
    loadManagers();
  }, [tenantId]);

  const loadManagers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getManagersByCompany(tenantId);
      setManagers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading managers";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Computed filtered managers
  const filteredManagers = useMemo(() => {
    return managers.filter((manager) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          manager.fullName.toLowerCase().includes(searchTerm) ||
          manager.email.toLowerCase().includes(searchTerm) ||
          manager.ci.includes(searchTerm) ||
          manager.branches.some((branch) =>
            branch.name.toLowerCase().includes(searchTerm)
          );

        if (!matchesSearch) return false;
      }

      // Branch filter
      if (filters.branch !== "all") {
        if (filters.branch === "none" && manager.branches.length > 0)
          return false;
        if (
          filters.branch !== "none" &&
          !manager.branches.some(
            (branch) => branch.id.toString() === filters.branch
          )
        )
          return false;
      }

      // Status filter (all managers are active for now)
      if (filters.status !== "all") return false;

      return true;
    });
  }, [managers, filters]);

  // Computed metrics
  const metrics: ManagerMetrics = useMemo(() => {
    const total = managers.length;
    const active = managers.length; // All loaded managers are active
    const withBranch = managers.filter(
      (m) => m.branches && m.branches.length > 0
    ).length;
    const withoutBranch = total - withBranch;

    return { total, active, withBranch, withoutBranch };
  }, [managers]);

  // Validation functions
  const validateManagerEmail = (email: string): boolean => {
    if (!company?.slug) return false;
    const expectedDomain = `@${company.slug}.com`;
    return email.endsWith(expectedDomain);
  };

  const validateCreateManagerData = (
    data: CreateManagerData
  ): string | null => {
    if (!data.firstName?.trim()) return "El nombre es requerido";
    if (!data.lastName?.trim()) return "El apellido es requerido";
    if (!data.ci?.trim()) return "La cédula es requerida";
    if (!data.email?.trim()) return "El correo electrónico es requerido";
    if (!data.password?.trim()) return "La contraseña es requerida";

    // Password validation: 8 chars min, at least one uppercase
    if (data.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(data.password)) {
      return "La contraseña debe contener al menos una mayúscula";
    }

    if (!validateManagerEmail(data.email)) {
      return `El correo debe terminar en @${company?.slug}.com`;
    }
    return null;
  };

  const validateUpdateManagerData = (
    data: UpdateManagerData
  ): string | null => {
    if (data.firstName !== undefined && !data.firstName?.trim())
      return "El nombre es requerido";
    if (data.lastName !== undefined && !data.lastName?.trim())
      return "El apellido es requerido";
    if (data.ci !== undefined && !data.ci?.trim())
      return "La cédula es requerida";
    if (data.email !== undefined && !data.email?.trim())
      return "El correo electrónico es requerido";
    if (data.email && !validateManagerEmail(data.email)) {
      return `El correo debe terminar en @${company?.slug}.com`;
    }
    return null;
  };

  // CRUD operations
  const handleCreateManager = async (data: CreateManagerData) => {
    const validationError = validateCreateManagerData(data);
    if (validationError) {
      toast.error(validationError);
      throw new Error(validationError);
    }

    try {
      await createManager(tenantId, data);
      await loadManagers();
      toast.success("Encargado creado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creando encargado";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleUpdateManager = async (
    managerId: number,
    data: UpdateManagerData
  ) => {
    const validationError = validateUpdateManagerData(data);
    if (validationError) {
      toast.error(validationError);
      throw new Error(validationError);
    }

    try {
      await updateManager(managerId, data);
      await loadManagers();
      toast.success("Encargado actualizado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error actualizando encargado";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteManager = async (
    managerId: number,
    adminPassword: string
  ) => {
    try {
      // Validar contraseña del administrador (por ahora solo longitud)
      await validateAdminPassword(tenantId, "", adminPassword);

      // Si la validación pasa, proceder con la eliminación
      await deleteManager(managerId);
      await loadManagers();
      toast.success("Encargado eliminado exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error eliminando encargado";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    managers: filteredManagers,
    allManagers: managers,
    metrics,
    isLoading,
    error,
    filters,
    setFilters,
    createManager: handleCreateManager,
    updateManager: handleUpdateManager,
    deleteManager: handleDeleteManager,
    reloadManagers: loadManagers,
  };
}
