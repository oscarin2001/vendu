"use client";

import { useState } from "react";
import { BranchForm } from "@/components/admin/branches/forms/BranchForm";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import { BranchDetailsModal } from "@/components/admin/branches/modals/details/BranchDetailsModal";
import { BranchServiceConfigModal } from "@/components/admin/branches/modals/service/BranchServiceConfigModal";
import { BranchDeleteInitialModal } from "@/components/admin/branches/modals/delete/BranchDeleteInitialModal";
import { BranchDeleteWarningModal } from "@/components/admin/branches/modals/delete/BranchDeleteWarningModal";
import { BranchDeleteFinalModal } from "@/components/admin/branches/modals/delete/BranchDeleteFinalModal";
import { BranchEditFinalModal } from "@/components/admin/branches/modals/edit/BranchEditFinalModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Branch } from "@/services/admin/branches";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

interface BranchesModalsProps {
  selectedBranch: Branch | null;
  tenantId: string;
  companyCountry?: string;
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isConfigureModalOpen: boolean;
  // Delete flow
  isDeleteDialogOpen: boolean;
  isDeleteWarningModalOpen: boolean;
  isDeleteFinalModalOpen: boolean;
  isDeleting: boolean;
  // Callbacks
  onCreateModalChange: (open: boolean) => void;
  onEditModalChange: (open: boolean) => void;
  onDetailsModalChange: (open: boolean) => void;
  onConfigureModalChange: (open: boolean) => void;
  onDeleteNext: () => void;
  onDeletePrevious: () => void;
  onDeleteCancel: () => void;
  onSubmitCreate: (data: any) => void;
  onSubmitEdit: (data: any) => void;
  onConfirmDelete: (password: string) => void;
  onRefresh: () => void;
}

export function BranchesModals({
  selectedBranch,
  tenantId,
  companyCountry,
  isCreateModalOpen,
  isEditModalOpen,
  isDetailsModalOpen,
  isConfigureModalOpen,
  isDeleteDialogOpen,
  isDeleteWarningModalOpen,
  isDeleteFinalModalOpen,
  isDeleting,
  onCreateModalChange,
  onEditModalChange,
  onDetailsModalChange,
  onConfigureModalChange,
  onDeleteNext,
  onDeletePrevious,
  onDeleteCancel,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmDelete,
  onRefresh,
}: BranchesModalsProps) {
  // Change reason state
  const [isChangeReasonOpen, setIsChangeReasonOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<FieldChange[]>([]);
  const [pendingEditReason, setPendingEditReason] = useState<string | null>(
    null,
  );
  const [isEditFinalOpen, setIsEditFinalOpen] = useState(false);
  const [editFinalError, setEditFinalError] = useState<string | undefined>(
    undefined,
  );
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleEditRequest = (data: any, changes: FieldChange[]) => {
    setPendingEditData(data);
    setPendingChanges(changes);
    setIsChangeReasonOpen(true);
  };

  const handleConfirmEditWithReason = async (reason: string) => {
    if (!pendingEditData) return;
    // store reason and open final confirmation (name + password)
    setPendingEditReason(reason);
    setIsChangeReasonOpen(false);
    setIsEditFinalOpen(true);
  };

  const handleConfirmEditFinal = async (password: string) => {
    if (!pendingEditData) return;
    setIsSubmittingEdit(true);
    try {
      // send both reason and confirmation password to submit handler
      await onSubmitEdit({
        ...pendingEditData,
        _changeReason: pendingEditReason,
        _confirmPassword: password,
      });
      setIsEditFinalOpen(false);
      setPendingEditData(null);
      setPendingChanges([]);
      setPendingEditReason(null);
      setEditFinalError(undefined);
    } catch (error: any) {
      if (error?.name === "ValidationError") {
        setEditFinalError(error.message || "Error de validación");
        return;
      }
      throw error;
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleCloseChangeReason = () => {
    setIsChangeReasonOpen(false);
    setPendingEditData(null);
    setPendingChanges([]);
  };

  return (
    <>
      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={onCreateModalChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Sucursal</DialogTitle>
          </DialogHeader>
          <BranchForm
            onSubmit={onSubmitCreate}
            mode="create"
            companyCountry={companyCountry}
            onCancel={() => onCreateModalChange(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
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
                country: selectedBranch.country || "",
              }}
              onSubmit={onSubmitEdit}
              onEditRequest={handleEditRequest}
              mode="edit"
              companyCountry={companyCountry}
              branchInfo={{
                id: selectedBranch.id,
                createdAt: selectedBranch.createdAt,
                updatedAt: selectedBranch.updatedAt,
                createdBy: selectedBranch.createdBy,
                updatedBy: selectedBranch.updatedBy,
              }}
              onCancel={() => onEditModalChange(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Change Reason Dialog */}
      <ChangeReasonDialog
        isOpen={isChangeReasonOpen}
        onClose={handleCloseChangeReason}
        onConfirm={handleConfirmEditWithReason}
        title="Confirmar cambios en Sucursal"
        changes={pendingChanges}
        isLoading={isSubmittingEdit}
        entityName="sucursal"
      />

      {/* Final edit confirmation (name + password) */}
      {selectedBranch && (
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
      )}

      {/* Details Modal */}
      {selectedBranch && (
        <BranchDetailsModal
          branch={selectedBranch}
          isOpen={isDetailsModalOpen}
          onClose={() => onDetailsModalChange(false)}
        />
      )}

      {/* Configure Modal */}
      {selectedBranch && (
        <BranchServiceConfigModal
          branch={selectedBranch}
          isOpen={isConfigureModalOpen}
          onClose={() => onConfigureModalChange(false)}
          tenantId={tenantId}
          onSuccess={onRefresh}
        />
      )}

      {/* Delete Modals */}
      {selectedBranch && (
        <>
          <BranchDeleteInitialModal
            branch={selectedBranch}
            isOpen={isDeleteDialogOpen}
            onClose={onDeleteCancel}
            onNext={onDeleteNext}
          />
          <BranchDeleteWarningModal
            branch={selectedBranch}
            isOpen={isDeleteWarningModalOpen}
            onClose={onDeleteCancel}
            onNext={onDeleteNext}
            onPrevious={onDeletePrevious}
          />
          <BranchDeleteFinalModal
            branch={selectedBranch}
            isOpen={isDeleteFinalModalOpen}
            onClose={onDeleteCancel}
            onPrevious={onDeletePrevious}
            onConfirm={onConfirmDelete}
            isLoading={isDeleting}
          />
        </>
      )}
    </>
  );
}
