"use client";

import { useState } from "react";
import { WarehouseDetailsModal } from "@/components/admin/warehouses/components/modals/WarehouseDetailsModal";
import { WarehouseServiceConfigModal } from "@/components/admin/warehouses/components/modals/WarehouseServiceConfigModal";
import { WarehouseDeleteInitialModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteInitialModal";
import { WarehouseDeleteWarningModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteWarningModal";
import { WarehouseDeleteFinalModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteFinalModal";
import { WarehouseEditFinalModal } from "@/components/admin/warehouses/components/modals/WarehouseEditFinalModal";
import { WarehouseForm } from "@/components/admin/warehouses/forms/WarehouseForm";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Warehouse } from "@/services/admin/warehouses/types/warehouse.types";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

interface WarehousesModalsProps {
  selectedWarehouse: Warehouse | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isConfigureModalOpen: boolean;
  deleteStep: "initial" | "warning" | "final";
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
  tenantId: string;
  companyCountry?: string;
  onCreateModalChange: (open: boolean) => void;
  onEditModalChange: (open: boolean) => void;
  onDetailsModalChange: (open: boolean) => void;
  onConfigureModalChange: (open: boolean) => void;
  onDeleteModalChange: (open: boolean) => void;
  onDeleteNext: () => void;
  onDeletePrevious: () => void;
  onConfirmDelete: (password: string) => void;
  onCloseModals: () => void;
  onSubmitCreate: (data: any) => void;
  onSubmitEdit: (data: any) => void;
  onRefresh: () => void;
}

export function WarehousesModals({
  selectedWarehouse,
  isCreateModalOpen,
  isEditModalOpen,
  isDetailsModalOpen,
  isConfigureModalOpen,
  deleteStep,
  isDeleteModalOpen,
  isDeleting,
  tenantId,
  companyCountry,
  onCreateModalChange,
  onEditModalChange,
  onDetailsModalChange,
  onConfigureModalChange,
  onDeleteModalChange,
  onDeleteNext,
  onDeletePrevious,
  onConfirmDelete,
  onCloseModals,
  onSubmitCreate,
  onSubmitEdit,
  onRefresh,
}: WarehousesModalsProps) {
  const [isChangeReasonOpen, setIsChangeReasonOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<FieldChange[]>([]);
  const [pendingEditReason, setPendingEditReason] = useState<string | null>(null);
  const [isEditFinalOpen, setIsEditFinalOpen] = useState(false);
  const [editFinalError, setEditFinalError] = useState<string | undefined>(undefined);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

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

  const handleConfirmEditFinal = async (password: string) => {
    if (!pendingEditData) return;
    setIsSubmittingEdit(true);
    try {
      await onSubmitEdit({ ...pendingEditData, _changeReason: pendingEditReason, _confirmPassword: password });
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

  const handleCancelChangeReason = () => {
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
            <DialogTitle>Crear Bodega</DialogTitle>
          </DialogHeader>
          <WarehouseForm
            onSubmit={onSubmitCreate}
            mode="create"
            companyCountry={companyCountry}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Bodega</DialogTitle>
          </DialogHeader>
          {selectedWarehouse && (
            <WarehouseForm
              initialData={{
                name: selectedWarehouse.name,
                phone: selectedWarehouse.phone || "",
                address: selectedWarehouse.address,
                city: selectedWarehouse.city,
                department: selectedWarehouse.department || "",
                country: selectedWarehouse.country || companyCountry,
              }}
              onSubmit={onSubmitEdit}
              onEditRequest={handleEditRequest}
              mode="edit"
              companyCountry={companyCountry}
              warehouseInfo={{
                id: selectedWarehouse.id,
                createdAt: selectedWarehouse.createdAt,
                updatedAt: selectedWarehouse.updatedAt,
              }}
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
        entityName="bodega"
      />

      {/* Final edit confirmation (name + password) */}
      {selectedWarehouse && (
        <WarehouseEditFinalModal
          warehouse={selectedWarehouse}
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
      <WarehouseDetailsModal
        warehouse={selectedWarehouse}
        isOpen={isDetailsModalOpen}
        onClose={() => onDetailsModalChange(false)}
        tenantId={tenantId}
      />

      {/* Delete Modals */}
      {deleteStep === "initial" && (
        <WarehouseDeleteInitialModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={onCloseModals}
          onNext={onDeleteNext}
        />
      )}

      {deleteStep === "warning" && (
        <WarehouseDeleteWarningModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={onCloseModals}
          onNext={onDeleteNext}
          onPrevious={onDeletePrevious}
        />
      )}

      {deleteStep === "final" && (
        <WarehouseDeleteFinalModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={onCloseModals}
          onPrevious={onDeletePrevious}
          onConfirm={onConfirmDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Service Configuration Modal */}
      <WarehouseServiceConfigModal
        warehouse={selectedWarehouse}
        isOpen={isConfigureModalOpen}
        onClose={() => onConfigureModalChange(false)}
        tenantId={tenantId}
        onSuccess={onRefresh}
      />
    </>
  );
}
