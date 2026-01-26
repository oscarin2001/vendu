"use client";

import { useState } from "react";
import { SupplierForm } from "@/components/admin/suppliers/forms/SupplierForm";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import { SupplierDeleteInitialModal } from "./SupplierDeleteInitialModal";
import { SupplierDeleteWarningModal } from "./SupplierDeleteWarningModal";
import { SupplierDeleteFinalModal } from "./SupplierDeleteFinalModal";
import { SupplierEditFinalModal } from "./SupplierEditFinalModal";
import { SupplierServiceConfigModal } from "./SupplierServiceConfigModal";
import { SupplierStatusToggleModal } from "./SupplierStatusToggleModal";
import { SupplierDetailsModal } from "./SupplierDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Supplier } from "@/services/admin/suppliers";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

interface SuppliersModalsProps {
  selectedSupplier: Supplier | null;
  tenantId: string;
  companyCountry?: string;
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isConfigureModalOpen: boolean;
  isStatusToggleModalOpen: boolean;
  // Delete flow
  deleteStep: 1 | 2 | 3;
  isDeleteInitialModalOpen: boolean;
  isDeleteWarningModalOpen: boolean;
  isDeleteFinalModalOpen: boolean;
  isDeleting: boolean;
  isTogglingStatus: boolean;
  // Callbacks
  onCreateModalChange: (open: boolean) => void;
  onEditModalChange: (open: boolean) => void;
  onDetailsModalChange: (open: boolean) => void;
  onConfigureModalChange: (open: boolean) => void;
  onStatusToggleModalChange: (open: boolean) => void;
  onDeleteNext: () => void;
  onDeletePrevious: () => void;
  onDeleteCancel: () => void;
  onSubmitCreate: (data: any) => void;
  onSubmitEdit: (data: any) => void;
  onConfirmDelete: (password: string) => void;
  onStatusToggleConfirm: (supplierId: number) => void;
  onRefresh: () => void;
}

export function SuppliersModals({
  selectedSupplier,
  tenantId,
  companyCountry,
  isCreateModalOpen,
  isEditModalOpen,
  isDetailsModalOpen,
  isConfigureModalOpen,
  isStatusToggleModalOpen,
  deleteStep,
  isDeleteInitialModalOpen,
  isDeleteWarningModalOpen,
  isDeleteFinalModalOpen,
  isDeleting,
  isTogglingStatus,
  onCreateModalChange,
  onEditModalChange,
  onDetailsModalChange,
  onConfigureModalChange,
  onStatusToggleModalChange,
  onDeleteNext,
  onDeletePrevious,
  onDeleteCancel,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmDelete,
  onStatusToggleConfirm,
  onRefresh,
}: SuppliersModalsProps) {
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
    setPendingEditReason(reason);
    setIsChangeReasonOpen(false);
    setIsEditFinalOpen(true);
  };

  const handleConfirmEditFinal = async (
    password: string,
    overrides?: { isIndefinite?: boolean; contractEndAt?: Date | null },
  ) => {
    if (!pendingEditData) return;
    setIsSubmittingEdit(true);
    try {
      await onSubmitEdit({
        ...pendingEditData,
        ...(overrides || {}),
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <SupplierForm
            onSubmit={onSubmitCreate}
            mode="create"
            companyCountry={companyCountry}
            onCancel={() => onCreateModalChange(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm
              initialData={{
                firstName: selectedSupplier.firstName,
                lastName: selectedSupplier.lastName,
                ci: selectedSupplier.ci || undefined,
                phone: selectedSupplier.phone || "",
                email: selectedSupplier.email || "",
                address: selectedSupplier.address || "",
                city: selectedSupplier.city || "",
                department: selectedSupplier.department || "",
                country: selectedSupplier.country || "",
                notes: selectedSupplier.notes || "",
                birthDate: selectedSupplier.birthDate,
                partnerSince: selectedSupplier.partnerSince,
                contractEndAt: selectedSupplier.contractEndAt,
                isIndefinite: selectedSupplier.isIndefinite,
              }}
              onSubmit={onSubmitEdit}
              onEditRequest={handleEditRequest}
              mode="edit"
              companyCountry={companyCountry}
              supplierInfo={{
                id: selectedSupplier.id,
                createdAt: selectedSupplier.createdAt,
                updatedAt: selectedSupplier.updatedAt,
                createdBy: selectedSupplier.createdBy,
                updatedBy: selectedSupplier.updatedBy,
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
        title="Confirmar cambios en Proveedor"
        changes={pendingChanges}
        isLoading={isSubmittingEdit}
        entityName="proveedor"
      />

      {/* Final edit confirmation (name + password) */}
      {selectedSupplier && (
        <SupplierEditFinalModal
          supplier={selectedSupplier}
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
      <SupplierDetailsModal
        supplier={selectedSupplier}
        isOpen={isDetailsModalOpen}
        onClose={() => onDetailsModalChange(false)}
      />

      {/* Status Toggle Modal */}
      <SupplierStatusToggleModal
        supplier={selectedSupplier}
        isOpen={isStatusToggleModalOpen}
        onClose={() => onStatusToggleModalChange(false)}
        onConfirm={onStatusToggleConfirm}
        isLoading={isTogglingStatus}
      />

      {/* Configure Modal */}
      <SupplierServiceConfigModal
        supplier={selectedSupplier}
        isOpen={isConfigureModalOpen}
        onClose={() => onConfigureModalChange(false)}
        tenantId={tenantId}
        onSuccess={onRefresh}
      />

      {/* Delete Modals */}
      <SupplierDeleteInitialModal
        supplier={selectedSupplier}
        isOpen={isDeleteInitialModalOpen}
        onClose={onDeleteCancel}
        onNext={onDeleteNext}
      />
      <SupplierDeleteWarningModal
        supplier={selectedSupplier}
        isOpen={isDeleteWarningModalOpen}
        onClose={onDeleteCancel}
        onNext={onDeleteNext}
        onPrevious={onDeletePrevious}
      />
      <SupplierDeleteFinalModal
        supplier={selectedSupplier}
        isOpen={isDeleteFinalModalOpen}
        onClose={onDeleteCancel}
        onPrevious={onDeletePrevious}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
