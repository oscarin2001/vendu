"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BranchesMetrics } from "@/components/admin/branches/metrics";
import { BranchesFilters } from "@/components/admin/branches/shared/components";
import { BranchesTable } from "@/components/admin/branches/tables/BranchesTable";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
import { BranchDetailsModal } from "@/components/admin/branches/modals/details/BranchDetailsModal";
import { BranchServiceConfigModal } from "@/components/admin/branches/modals/service/BranchServiceConfigModal";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);
  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] =
    useState(false);
  const [isDeleteFinalModalOpen, setIsDeleteFinalModalOpen] = useState(false);

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

  const handleDeleteBranchStart = (branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteStep(1);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteNextStep = () => {
    if (deleteStep === 1) {
      setIsDeleteDialogOpen(false);
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
      setIsDeleteDialogOpen(true);
      setDeleteStep(1);
    } else if (deleteStep === 3) {
      setIsDeleteFinalModalOpen(false);
      setIsDeleteWarningModalOpen(true);
      setDeleteStep(2);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setIsDeleteWarningModalOpen(false);
    setIsDeleteFinalModalOpen(false);
    setSelectedBranch(null);
    setDeleteStep(1);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!selectedBranch) return;

    setIsDeleting(true);
    try {
      // Do not send mocked user context. Server will resolve the
      // authenticated user from the cookie for password validation.
      await deleteBranch(selectedBranch.id, password);
      handleDeleteCancel(); // Close all modals
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
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

  const handleEditSubmit = async (data: any) => {
    if (!selectedBranch) return;

    try {
      await updateBranch(selectedBranch.id, data);
      setIsEditModalOpen(false);
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

      {/* TODO: Add other individual modals here following the standard pattern */}

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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
            mode="create"
            companyCountry={company?.country}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            initialData={selectedBranch ? {
              name: selectedBranch.name,
              phone: selectedBranch.phone || "",
              address: selectedBranch.address,
              city: selectedBranch.city,
              department: selectedBranch.department || "",
              country: selectedBranch.country || "",
              openedAt: selectedBranch.openedAt,
            } : undefined}
            onSubmit={handleEditSubmit}
            isLoading={isLoading}
            mode="edit"
            branchInfo={selectedBranch ? {
              id: selectedBranch.id,
              createdAt: selectedBranch.createdAt,
              updatedAt: selectedBranch.updatedAt,
              createdBy: selectedBranch.createdBy,
              updatedBy: selectedBranch.updatedBy,
            } : undefined}
            companyCountry={company?.country}
          />
        </DialogContent>
      </Dialog>

      {/* Configure Modal */}
      <BranchServiceConfigModal
        branch={selectedBranch}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={refresh}
      />
    </div>
  );
}
