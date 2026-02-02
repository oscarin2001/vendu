"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ManagersMetricsGrid } from "@/components/admin/managers/metrics";
import { ManagersFilters } from "@/components/admin/managers/shared/components";
import { ManagersTable } from "@/components/admin/managers/tables";
import { ManagerForm } from "@/components/admin/managers/forms/ManagerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ManagerDeleteInitialModal, ManagerDeleteWarningModal, ManagerDeleteFinalModal } from "@/components/admin/managers/components/modals/deleteModal";
import { ManagerEditFinalModal } from "@/components/admin/managers/components/modals/editModal";
import { ManagerServiceConfigModal } from "@/components/admin/managers/components/modals/ManagerServiceConfigModal";
import { ManagerStatusToggleModal } from "@/components/admin/managers/components/modals/ManagerStatusToggleModal";
import { ManagerDetailsModal } from "@/components/admin/managers/components/modals/ManagerDetailsModal";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import { useManagers } from "@/services/admin/managers";
import { useBranches } from "@/services/admin/branches/hooks/useBranches";
import { useCompany } from "@/services/admin/company";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export function ManagersPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Get company data for country default
  const { company } = useCompany(tenantId);

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
  const [deleteStep, setDeleteStep] = useState<"initial" | "warning" | "final">("initial");
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit flow states (with change tracking)
  const [isChangeReasonOpen, setIsChangeReasonOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<FieldChange[]>([]);
  const [pendingEditReason, setPendingEditReason] = useState<string | null>(null);
  const [isEditFinalOpen, setIsEditFinalOpen] = useState(false);
  const [editFinalError, setEditFinalError] = useState<string | undefined>(undefined);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

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
    refresh();
  };

  // Edit flow handlers (with change tracking)
  const handleEditRequest = (data: any, changes: FieldChange[]) => {
    setPendingEditData(data);
    setPendingChanges(changes);
    setIsChangeReasonOpen(true);
  };

  const handleConfirmEditWithReason = (reason: string) => {
    if (!pendingEditData) return;
    setPendingEditReason(reason);
    setIsChangeReasonOpen(false);
    setIsEditFinalOpen(true);
  };

  const handleCancelChangeReason = () => {
    setIsChangeReasonOpen(false);
    setPendingEditData(null);
    setPendingChanges([]);
  };

  const handleConfirmEditFinal = async (password: string) => {
    if (!pendingEditData || !selectedManager) return;
    setIsSubmittingEdit(true);
    try {
      await updateManager(selectedManager.id, {
        ...pendingEditData,
        _changeReason: pendingEditReason,
        _confirmPassword: password,
      });
      setIsEditFinalOpen(false);
      setIsEditModalOpen(false);
      setPendingEditData(null);
      setPendingChanges([]);
      setPendingEditReason(null);
      setEditFinalError(undefined);
      setSelectedManager(null);
    } catch (error: any) {
      if (error?.name === "ValidationError") {
        setEditFinalError(error.message || "Error de validación");
        return;
      }
      setEditFinalError(error?.message || "Error al actualizar");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleConfirmDelete = async (password: string) => {
    if (!selectedManager) return;

    setIsDeleting(true);
    try {
      await deleteManager(selectedManager.id, password);
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Encargado</DialogTitle>
          </DialogHeader>
          <ManagerForm
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
            mode="create"
            branches={branches}
            companyCountry={company?.country}
            tenantId={tenantId}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Encargado</DialogTitle>
          </DialogHeader>
          {selectedManager && (
            <ManagerForm
              initialData={{
                firstName: selectedManager.firstName,
                lastName: selectedManager.lastName,
                ci: selectedManager.ci,
                phone: selectedManager.phone || "",
                email: selectedManager.email,
                birthDate: selectedManager.birthDate ? new Date(selectedManager.birthDate) : undefined,
                homeAddress: selectedManager.homeAddress || "",
                hireDate: new Date(selectedManager.hireDate),
                salary: selectedManager.salary,
                contractEndAt: selectedManager.contractEndAt ? new Date(selectedManager.contractEndAt) : undefined,
                isIndefinite: selectedManager.isIndefinite,
              }}
              onEditRequest={handleEditRequest}
              isLoading={isLoading}
              mode="edit"
              branches={branches}
              companyCountry={company?.country}
              tenantId={tenantId}
              managerInfo={{
                id: selectedManager.id,
                createdAt: selectedManager.createdAt,
                updatedAt: selectedManager.updatedAt,
                createdBy: selectedManager.createdBy,
                updatedBy: selectedManager.updatedBy,
              }}
              onCancel={() => setIsEditModalOpen(false)}
              onSubmit={() => {}} // Not used in edit mode
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Change Reason Dialog */}
      <ChangeReasonDialog
        isOpen={isChangeReasonOpen}
        onClose={handleCancelChangeReason}
        onConfirm={handleConfirmEditWithReason}
        changes={pendingChanges}
        entityName="encargado"
      />

      {/* Final edit confirmation (name + password) */}
      <ManagerEditFinalModal
        manager={selectedManager}
        isOpen={isEditFinalOpen}
        onClose={() => {
          setIsEditFinalOpen(false);
          setEditFinalError(undefined);
        }}
        onPrevious={() => {
          setIsEditFinalOpen(false);
          setIsChangeReasonOpen(true);
          setEditFinalError(undefined);
        }}
        onConfirm={handleConfirmEditFinal}
        isLoading={isSubmittingEdit}
        error={editFinalError}
      />

      {/* Details Modal */}
      <ManagerDetailsModal
        manager={selectedManager}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Service Configuration Modal */}
      <ManagerServiceConfigModal
        manager={selectedManager}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={handleReloadManagers}
      />

      {/* Status Toggle Modal */}
      <ManagerStatusToggleModal
        manager={selectedManager}
        isOpen={isStatusToggleModalOpen}
        onClose={() => setIsStatusToggleModalOpen(false)}
        onConfirm={handleConfirmStatusToggle}
        isLoading={isLoading}
      />

      {/* Delete Modals */}
      <ManagerDeleteInitialModal
        manager={selectedManager}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onNext={() => setDeleteStep("warning")}
      />

      <ManagerDeleteWarningModal
        manager={selectedManager}
        isOpen={deleteStep === "warning"}
        onClose={() => setIsDeleteModalOpen(false)}
        onNext={() => setDeleteStep("final")}
        onPrevious={() => setDeleteStep("initial")}
      />

      <ManagerDeleteFinalModal
        manager={selectedManager}
        isOpen={deleteStep === "final"}
        onClose={() => setIsDeleteModalOpen(false)}
        onPrevious={() => setDeleteStep("warning")}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
