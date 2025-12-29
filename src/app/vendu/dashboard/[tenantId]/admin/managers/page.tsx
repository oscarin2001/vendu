"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ManagersMetrics } from "@/components/admin/managers/components/ManagersMetrics";
import { ManagersFilters } from "@/components/admin/managers/components/ManagersFilters";
import { ManagersTable } from "@/components/admin/managers/components/ManagersTable";
import { ManagerDetailsModal } from "@/components/admin/managers/components/modals/ManagerDetailsModal";
import { ManagerCreateModal } from "@/components/admin/managers/components/modals/ManagerCreateModal";
import { ManagerEditModal } from "@/components/admin/managers/components/modals/ManagerEditModal";
import { useManagers } from "@/services/admin/managers/hooks/useManagers";
import { useBranches } from "@/services/admin/branches/hooks/useBranches";

export default function ManagersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hooks
  const {
    managers,
    metrics,
    isLoading,
    filters,
    setFilters,
    createManager,
    updateManager,
    deleteManager,
  } = useManagers(tenantId);

  const { branches } = useBranches(tenantId);

  // Modal states
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
    if (
      confirm(`¿Estás seguro de que quieres eliminar a ${manager.fullName}?`)
    ) {
      deleteManager(manager.id);
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
    if (!selectedManager) return;

    try {
      await updateManager(selectedManager.id, data);
      setIsEditModalOpen(false);
      setSelectedManager(null);
    } catch (error) {
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
        <Button
          onClick={handleCreateManager}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Encargado
        </Button>
      </div>

      {/* Metrics */}
      <ManagersMetrics metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <ManagersFilters
        filters={filters}
        onFiltersChange={setFilters}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
      />

      {/* Table */}
      <ManagersTable
        managers={managers}
        isLoading={isLoading}
        onViewDetails={handleViewManager}
        onEdit={handleEditManager}
        onDelete={handleDeleteManager}
      />

      {/* Modals */}
      <ManagerDetailsModal
        manager={selectedManager}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedManager(null);
        }}
      />

      <ManagerCreateModal
        tenantId={tenantId}
        branches={branches}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isLoading}
      />

      <ManagerEditModal
        tenantId={tenantId}
        manager={selectedManager}
        branches={branches}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedManager(null);
        }}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
