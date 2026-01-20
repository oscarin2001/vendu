"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BranchesMetrics } from "@/components/admin/branches/metrics";
import { BranchesFilters } from "@/components/admin/branches/shared/components";
import { BranchesTable } from "@/components/admin/branches/tables/BranchesTable";
import { BranchDetailsModal } from "@/components/admin/branches/modals/details/BranchDetailsModal";
import { BranchServiceConfigModal } from "@/components/admin/branches/modals/service/BranchServiceConfigModal";
import { BranchDeleteInitialModal } from "@/components/admin/branches/modals/delete/BranchDeleteInitialModal";
import { BranchDeleteWarningModal } from "@/components/admin/branches/modals/delete/BranchDeleteWarningModal";
import { BranchDeleteFinalModal } from "@/components/admin/branches/modals/delete/BranchDeleteFinalModal";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
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
      // TODO: Get real user context from authentication
      const userContext = {
        employeeId: 1, // Mock user ID
        companyId: 1, // Mock company ID
        ipAddress: "127.0.0.1", // Mock IP
        userAgent: "Mock User Agent",
      };

      await deleteBranch(selectedBranch.id, password, userContext);
      handleDeleteCancel(); // Close all modals
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            onSubmit={async (data) => {
              await createBranch(data);
              setIsCreateModalOpen(false);
            }}
            mode="create"
            companyCountry={company?.country}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
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
                country: selectedBranch.country || "",
              }}
              onSubmit={async (data) => {
                await updateBranch(selectedBranch.id, data);
                setIsEditModalOpen(false);
                setSelectedBranch(null);
              }}
              mode="edit"
              companyCountry={company?.country}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      {selectedBranch && (
        <BranchDetailsModal
          branch={selectedBranch}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBranch(null);
          }}
        />
      )}

      {/* Service Configuration Modal */}
      {selectedBranch && (
        <BranchServiceConfigModal
          branch={selectedBranch}
          isOpen={isConfigureModalOpen}
          onClose={() => {
            setIsConfigureModalOpen(false);
            setSelectedBranch(null);
          }}
          tenantId={tenantId}
          onSuccess={refresh}
        />
      )}

      {/* Delete Modals */}
      {selectedBranch && (
        <>
          <BranchDeleteInitialModal
            branch={selectedBranch}
            isOpen={isDeleteDialogOpen}
            onClose={handleDeleteCancel}
            onNext={handleDeleteNextStep}
          />
          <BranchDeleteWarningModal
            branch={selectedBranch}
            isOpen={isDeleteWarningModalOpen}
            onClose={handleDeleteCancel}
            onNext={handleDeleteNextStep}
            onPrevious={handleDeletePreviousStep}
          />
          <BranchDeleteFinalModal
            branch={selectedBranch}
            isOpen={isDeleteFinalModalOpen}
            onClose={handleDeleteCancel}
            onPrevious={handleDeletePreviousStep}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
          />
        </>
      )}

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
