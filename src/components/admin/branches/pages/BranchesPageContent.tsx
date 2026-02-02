"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BranchesMetrics } from "@/components/admin/branches/metrics";
import { BranchesFilters } from "@/components/admin/branches/shared/components";
import { BranchesTable } from "@/components/admin/branches/tables/BranchesTable";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
import { BranchDetailsModal } from "@/components/admin/branches/modals/details/BranchDetailsModal";
import { BranchServiceConfigModal } from "@/components/admin/branches/modals/service/BranchServiceConfigModal";
import {
  BranchDeleteInitialModal,
  BranchDeleteWarningModal,
  BranchDeleteFinalModal,
} from "@/components/admin/branches/modals/delete";
import { BranchEditFinalModal } from "@/components/admin/branches/modals/edit/BranchEditFinalModal";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import { AuditHistory } from "@/components/admin/shared/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBranches } from "@/services/admin/branches/hooks/useBranches";
import { useCompany } from "@/services/admin/company";
import { Branch } from "@/services/admin/branches";
import { Building2 } from "lucide-react";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export function BranchesPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Get company data for country default
  const { company } = useCompany(tenantId);

  // Custom hook for branches logic
  const {
    branches,
    metrics,
    isLoading,
    filters,
    updateSearch,
    updateStatus,
    clearFilters,
    createBranch,
    updateBranch,
    deleteBranch,
    refresh,
  } = useBranches(tenantId);

  // Wrapper function for filters change
  const handleFiltersChange = (newFilters: {
    search: string;
    status: "all" | "withManager" | "withoutManager";
  }) => {
    updateSearch(newFilters.search);
    updateStatus(newFilters.status);
  };

  // Modal states
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);

  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<"initial" | "warning" | "final">("initial");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
  const handleCreateBranch = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDetailsModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  const handleConfigureBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsConfigureModalOpen(true);
  };

  const handleViewHistory = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsAuditHistoryOpen(true);
  };

  // Delete flow handlers
  const handleDeleteBranchStart = (branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteStep("initial");
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNext = () => {
    if (deleteStep === "initial") {
      setDeleteStep("warning");
    } else if (deleteStep === "warning") {
      setDeleteStep("final");
    }
  };

  const handleDeletePrevious = () => {
    if (deleteStep === "warning") {
      setDeleteStep("initial");
    } else if (deleteStep === "final") {
      setDeleteStep("warning");
    }
  };

  const handleCloseModals = () => {
    setIsDeleteModalOpen(false);
    setSelectedBranch(null);
    setDeleteStep("initial");
  };

  const handleConfirmDelete = async (password: string) => {
    if (!selectedBranch) return;

    setIsDeleting(true);
    try {
      await deleteBranch(selectedBranch.id, password);
      handleCloseModals();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
    }
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
    if (!pendingEditData || !selectedBranch) return;
    setIsSubmittingEdit(true);
    try {
      await updateBranch(selectedBranch.id, {
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
      setSelectedBranch(null);
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

  // Form handlers
  const handleCreateSubmit = async (data: any) => {
    try {
      await createBranch(data);
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Sucursales
          </h1>
          <p className="text-muted-foreground">
            Gestiona las sucursales de tu empresa
          </p>
        </div>
      </div>

      {/* Metrics */}
      <BranchesMetrics metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <BranchesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateBranch={handleCreateBranch}
      />

      {/* Table */}
      <BranchesTable
        branches={branches}
        isLoading={isLoading}
        onViewBranch={handleViewBranch}
        onConfigureBranch={handleConfigureBranch}
        onEditBranch={handleEditBranch}
        onDeleteBranch={handleDeleteBranchStart}
        onViewHistory={handleViewHistory}
      />

      {/* Details Modal */}
      <BranchDetailsModal
        branch={selectedBranch}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
            mode="create"
            companyCountry={company?.country}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Sucursal</DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <BranchForm
              initialData={{
                name: selectedBranch.name,
                phone: selectedBranch.phone || "",
                address: selectedBranch.address,
                city: selectedBranch.city,
                department: selectedBranch.department || "",
                country: selectedBranch.country || company?.country || "",
                openedAt: selectedBranch.openedAt,
              }}
              onEditRequest={handleEditRequest}
              isLoading={isLoading}
              mode="edit"
              branchInfo={{
                id: selectedBranch.id,
                createdAt: selectedBranch.createdAt,
                updatedAt: selectedBranch.updatedAt,
                createdBy: selectedBranch.createdBy,
                updatedBy: selectedBranch.updatedBy,
              }}
              companyCountry={company?.country}
              onCancel={() => setIsEditModalOpen(false)}
              onSubmit={() => {}} // Not used in edit mode, onEditRequest handles it
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
        entityName="sucursal"
      />

      {/* Final edit confirmation (name + password) */}
      <BranchEditFinalModal
        branch={selectedBranch}
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

      {/* Delete Modals */}
      {deleteStep === "initial" && (
        <BranchDeleteInitialModal
          branch={selectedBranch}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onNext={handleDeleteNext}
        />
      )}

      {deleteStep === "warning" && (
        <BranchDeleteWarningModal
          branch={selectedBranch}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onNext={handleDeleteNext}
          onPrevious={handleDeletePrevious}
        />
      )}

      {deleteStep === "final" && (
        <BranchDeleteFinalModal
          branch={selectedBranch}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onPrevious={handleDeletePrevious}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Configure Modal */}
      <BranchServiceConfigModal
        branch={selectedBranch}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={refresh}
      />

      {/* Audit History Modal */}
      {selectedBranch && (
        <AuditHistory
          isOpen={isAuditHistoryOpen}
          onClose={() => {
            setIsAuditHistoryOpen(false);
            setSelectedBranch(null);
          }}
          entityType="branch"
          entityId={selectedBranch.id.toString()}
        />
      )}
    </div>
  );
}
