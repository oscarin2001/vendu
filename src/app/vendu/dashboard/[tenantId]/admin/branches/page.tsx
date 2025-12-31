"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BranchesMetrics } from "@/components/admin/branches/components/BranchesMetrics";
import { BranchesFilters } from "@/components/admin/branches/components/BranchesFilters";
import { BranchesTable } from "@/components/admin/branches/components/BranchesTable";
import { BranchDetailsModal } from "@/components/admin/branches/components/modals/BranchDetailsModal";
import { BranchDeleteInitialModal } from "@/components/admin/branches/components/modals/BranchDeleteInitialModal";
import { BranchDeleteWarningModal } from "@/components/admin/branches/components/modals/BranchDeleteWarningModal";
import { BranchDeleteFinalModal } from "@/components/admin/branches/components/modals/BranchDeleteFinalModal";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBranches } from "@/services/admin/branches/hooks/useBranches";
import { Branch } from "@/services/admin/branches/types/branch.types";

export default function BranchesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hook for branches logic
  const {
    branches,
    managers,
    metrics,
    isLoading,
    filters,
    setFilters,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranches(tenantId);

  // Modal states
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      await deleteBranch(selectedBranch.id, password);
      handleDeleteCancel(); // Close all modals
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
    }
  };

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
      setSelectedBranch(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestión de Sucursales</h1>
        <p className="text-muted-foreground">
          Administra todas tus tiendas y bodegas desde un solo lugar.
        </p>
      </div>

      {/* Metrics */}
      <BranchesMetrics metrics={metrics} isLoading={isLoading} />

      {/* Filters and Actions */}
      <BranchesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onCreateBranch={handleCreateBranch}
      />

      {/* Table */}
      <BranchesTable
        branches={branches}
        isLoading={isLoading}
        onViewBranch={handleViewBranch}
        onEditBranch={handleEditBranch}
        onDeleteBranch={handleDeleteBranchStart}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            managers={managers}
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
            mode="create"
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
                isWarehouse: selectedBranch.isWarehouse,
                phone: selectedBranch.phone || "",
                address: selectedBranch.address,
                city: selectedBranch.city,
                department: selectedBranch.department || "",
                country: selectedBranch.country || "",
                managerIds: selectedBranch.managers.map((m) => m.id),
              }}
              managers={managers}
              onSubmit={handleEditSubmit}
              isLoading={isLoading}
              mode="edit"
              branchInfo={{
                id: selectedBranch.id,
                createdAt: selectedBranch.createdAt,
                updatedAt: selectedBranch.updatedAt,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <BranchDetailsModal
        branch={selectedBranch}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBranch(null);
        }}
      />

      {/* Delete Confirmation Flow */}
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
    </div>
  );
}
