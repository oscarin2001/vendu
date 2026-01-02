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
import { ManagerDeleteInitialModal } from "@/components/admin/managers/components/modals/ManagerDeleteInitialModal";
import { ManagerDeleteWarningModal } from "@/components/admin/managers/components/modals/ManagerDeleteWarningModal";
import { ManagerDeleteFinalModal } from "@/components/admin/managers/components/modals/ManagerDeleteFinalModal";
import { ManagerServiceConfigModal } from "@/components/admin/managers/components/modals/ManagerServiceConfigModal";

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
    toggleManagerStatus,
  } = useManagers(tenantId);

  const { branches } = useBranches(tenantId);

  // Modal states
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] =
    useState(false);
  const [isDeleteFinalModalOpen, setIsDeleteFinalModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);

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
    setDeleteStep(1);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNextStep = () => {
    if (deleteStep === 1) {
      setIsDeleteModalOpen(false);
      setIsDeleteWarningModalOpen(true);
      setDeleteStep(2);
    } else if (deleteStep === 2) {
      setIsDeleteWarningModalOpen(false);
      setIsDeleteFinalModalOpen(true);
      setDeleteStep(3);
    }
  };

  const handleDeletePreviousStep = () => {
    if (deleteStep === 2) {
      setIsDeleteWarningModalOpen(false);
      setIsDeleteModalOpen(true);
      setDeleteStep(1);
    } else if (deleteStep === 3) {
      setIsDeleteFinalModalOpen(false);
      setIsDeleteWarningModalOpen(true);
      setDeleteStep(2);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setIsDeleteWarningModalOpen(false);
    setIsDeleteFinalModalOpen(false);
    setSelectedManager(null);
    setDeleteStep(1);
  };

  const handleDeleteConfirm = async (password: string) => {
    if (!selectedManager) return;

    try {
      await deleteManager(selectedManager.id, password);
      handleDeleteCancel(); // Close all modals
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleToggleManagerStatus = async (manager: any) => {
    try {
      await toggleManagerStatus(manager);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleConfigureManager = (manager: any) => {
    setSelectedManager(manager);
    setIsConfigureModalOpen(true);
  };

  const handleReloadManagers = () => {
    // Recargar managers después de cambios en configuración
    window.location.reload();
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
        onToggleStatus={handleToggleManagerStatus}
        onConfigureService={handleConfigureManager}
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

      <ManagerDeleteInitialModal
        manager={selectedManager}
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onNext={handleDeleteNextStep}
      />

      <ManagerDeleteWarningModal
        manager={selectedManager}
        isOpen={isDeleteWarningModalOpen}
        onClose={handleDeleteCancel}
        onNext={handleDeleteNextStep}
        onPrevious={handleDeletePreviousStep}
      />

      <ManagerDeleteFinalModal
        manager={selectedManager}
        isOpen={isDeleteFinalModalOpen}
        onClose={handleDeleteCancel}
        onPrevious={handleDeletePreviousStep}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />

      {/* Service Configuration Modal */}
      <ManagerServiceConfigModal
        manager={selectedManager}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={handleReloadManagers}
      />
    </div>
  );
}
