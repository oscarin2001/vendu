"use client";

import { WarehouseDetailsModal } from "@/components/admin/warehouses/components/modals/WarehouseDetailsModal";
import { WarehouseServiceConfigModal } from "@/components/admin/warehouses/components/modals/WarehouseServiceConfigModal";
import { WarehouseDeleteInitialModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteInitialModal";
import { WarehouseDeleteWarningModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteWarningModal";
import { WarehouseDeleteFinalModal } from "@/components/admin/warehouses/components/modals/WarehouseDeleteFinalModal";
import { WarehouseForm } from "@/components/admin/warehouses/forms/WarehouseForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Warehouse } from "@/services/admin/warehouses/types/warehouse.types";

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
  return (
    <>
      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={onCreateModalChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Bodega</DialogTitle>
          </DialogHeader>
          <WarehouseForm onSubmit={onSubmitCreate} mode="create" />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                country: selectedWarehouse.country || "Bolivia",
              }}
              onSubmit={onSubmitEdit}
              mode="edit"
              warehouseInfo={{
                id: selectedWarehouse.id,
                createdAt: selectedWarehouse.createdAt,
                updatedAt: selectedWarehouse.updatedAt,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
