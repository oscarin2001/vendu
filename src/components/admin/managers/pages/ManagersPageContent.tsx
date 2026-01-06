"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ManagersMetricsGrid } from "@/components/admin/managers/metrics";
import { ManagersFilters } from "@/components/admin/managers/shared/components";
import { ManagersTable } from "@/components/admin/managers/tables";
import { ManagersModals } from "@/components/admin/managers/components/modals/ManagersModals";

import { useManagers } from "@/services/admin/managers";
import { useBranches } from "@/services/admin/branches/hooks/useBranches";

export function ManagersPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hooks
  const {
    managers,
    metrics,
    isLoading,
    filters,
    updateSearch,
    updateBranch,
    updateStatus,
    clearFilters,
    createManager,
    updateManager,
    deleteManager,
    toggleManagerStatus,
    refresh,
  } = useManagers(tenantId);

  const { branches } = useBranches(tenantId);

  // Filter change handler
  const handleFiltersChange = (newFilters: any) => {
    updateSearch(newFilters.search || "");
    updateBranch(newFilters.branch || "");
    updateStatus(newFilters.status || "all");
  };

  // Modal states
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isStatusToggleModalOpen, setIsStatusToggleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Modal handlers
  const handleCreateManager = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewManager = (manager: any) => {
    setSelectedManager(manager);
    setIsDetailsModalOpen(true);
  };

  const handleEditManager = (manager: any) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleDeleteManager = (manager: any) => {
    setSelectedManager(manager);
    setIsDeleteModalOpen(true);
  };

  const handleToggleManagerStatus = (manager: any) => {
    setSelectedManager(manager);
    setIsStatusToggleModalOpen(true);
  };

  const handleConfigureManager = (manager: any) => {
    setSelectedManager(manager);
    setIsConfigureModalOpen(true);
  };

  const handleReloadManagers = () => {
    // Recargar managers después de cambios en configuración
    window.location.reload();
  };

  const handleConfirmDelete = async (managerId: number, password: string) => {
    try {
      await deleteManager(managerId, password);
      setSelectedManager(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleConfirmStatusToggle = async (managerId: number) => {
    try {
      await toggleManagerStatus(managerId);
      setSelectedManager(null);
      setIsStatusToggleModalOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleCreateSubmit = async (data: any) => {
    try {
      await createManager(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedManager) {
      console.error("❌ No selectedManager found");
      return;
    }

    try {
      await updateManager(selectedManager.id, data);
      setIsEditModalOpen(false);
      setSelectedManager(null);
    } catch (error) {
      console.error("❌ Error in handleEditSubmit:", error);
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Encargados</h1>
          <p className="text-muted-foreground">
            Administra los encargados de tus sucursales
          </p>
        </div>
      </div>

      {/* Metrics */}
      <ManagersMetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <ManagersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
        onCreateManager={handleCreateManager}
      />

      {/* Table */}
      <ManagersTable
        managers={managers}
        isLoading={isLoading}
        onViewDetails={handleViewManager}
        onEdit={handleEditManager}
        onDelete={handleDeleteManager}
        onToggleStatus={handleToggleManagerStatus}
        onConfigureService={handleConfigureManager}
      />

      {/* Modals */}
      <ManagersModals
        selectedManager={selectedManager}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDetailsModalOpen={isDetailsModalOpen}
        isConfigureModalOpen={isConfigureModalOpen}
        isStatusToggleModalOpen={isStatusToggleModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        tenantId={tenantId}
        branches={branches}
        onCreateModalChange={setIsCreateModalOpen}
        onEditModalChange={setIsEditModalOpen}
        onDetailsModalChange={setIsDetailsModalOpen}
        onConfigureModalChange={setIsConfigureModalOpen}
        onStatusToggleModalChange={setIsStatusToggleModalOpen}
        onDeleteModalChange={setIsDeleteModalOpen}
        onSubmitCreate={handleCreateSubmit}
        onSubmitEdit={handleEditSubmit}
        onConfirmStatusToggle={handleConfirmStatusToggle}
        onConfirmDelete={handleConfirmDelete}
        onRefresh={refresh}
      />
    </div>
  );
}
