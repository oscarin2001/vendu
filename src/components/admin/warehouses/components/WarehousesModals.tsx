"use client";

import { useState } from "react";
import { WarehouseDetailsModal } from "@/components/admin/warehouses/components/modals/WarehouseDetailsModal";
import { WarehouseServiceConfigModal } from "@/components/admin/warehouses/components/modals/WarehouseServiceConfigModal";
import { WarehouseDeleteInitialModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteInitialModal";
import { WarehouseDeleteWarningModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteWarningModal";
import { WarehouseDeleteFinalModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteFinalModal";
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

  const handleEditRequest = (data: any, changes: FieldChange[]) => {
    setPendingEditData(data);
    setPendingChanges(changes);
    setIsChangeReasonOpen(true);
  };

  const handleConfirmEditWithReason = (reason: string) => {
    if (pendingEditData) {
      onSubmitEdit({ ...pendingEditData, _changeReason: reason });
    }
    setIsChangeReasonOpen(false);
    setPendingEditData(null);
    setPendingChanges([]);
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
