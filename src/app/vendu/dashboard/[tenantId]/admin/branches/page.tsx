"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BranchesMetrics } from "@/components/admin/branches/components/BranchesMetrics";
import { BranchesFilters } from "@/components/admin/branches/components/BranchesFilters";
import { BranchesTable } from "@/components/admin/branches/components/BranchesTable";
import { BranchDetailsModal } from "@/components/admin/branches/components/modals/BranchDetailsModal";
import { DeleteBranchDialog } from "@/components/admin/branches/components/modals/DeleteBranchDialog";
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

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;

    setIsDeleting(true);
    try {
      await deleteBranch(selectedBranch.id);
      setIsDeleteDialogOpen(false);
      setSelectedBranch(null);
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
        onDeleteBranch={handleDeleteBranch}
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
                managerId: selectedBranch.manager?.id,
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

      {/* Delete Confirmation */}
      <DeleteBranchDialog
        branch={selectedBranch}
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedBranch(null);
        }}
      />
    </div>
  );
}
