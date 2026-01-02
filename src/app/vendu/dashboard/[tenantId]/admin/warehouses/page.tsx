"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { WarehousesMetrics } from "@/components/admin/warehouses/components/WarehousesMetrics";
import { WarehousesFilters } from "@/components/admin/warehouses/components/WarehousesFilters";
import { WarehousesTable } from "@/components/admin/warehouses/components/WarehousesTable";
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
import { useWarehouses } from "@/services/admin/warehouses/hooks/useWarehouses";
import { Warehouse } from "@/services/admin/warehouses/types/warehouse.types";

export default function WarehousesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hook for warehouses logic
  const {
    warehouses,
    managers,
    branches,
    metrics,
    isLoading,
    filters,
    setFilters,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    refreshData,
  } = useWarehouses(tenantId);

  // Modal states
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);

  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<"initial" | "warning" | "final">(
    "initial"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Handlers
  const handleCreateWarehouse = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDetailsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditModalOpen(true);
  };

  const handleConfigureWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsConfigureModalOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
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

  const handleConfirmDelete = async (password: string) => {
    if (!selectedWarehouse) return;

    setIsDeleting(true);
    try {
      await deleteWarehouse(selectedWarehouse.id, password);
      setIsDeleteModalOpen(false);
      setSelectedWarehouse(null);
      setAdminPassword("");
      refreshData();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedWarehouse(null);
    setDeleteStep("initial");
    setAdminPassword("");
  };

  const handleSubmitCreate = async (data: any) => {
    try {
      await createWarehouse({
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        department: data.department,
        country: data.country,
      });
      setIsCreateModalOpen(false);
      refreshData();
    } catch (error) {
      console.error("Error creating warehouse:", error);
      throw error;
    }
  };

  const handleSubmitEdit = async (data: any) => {
    if (!selectedWarehouse) return;

    try {
      await updateWarehouse(selectedWarehouse.id, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        department: data.department,
        country: data.country,
      });
      setIsEditModalOpen(false);
      setSelectedWarehouse(null);
      refreshData();
    } catch (error) {
      console.error("Error updating warehouse:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bodegas</h1>
          <p className="text-muted-foreground">
            Gestiona tus bodegas centrales y su inventario
          </p>
        </div>
      </div>

      {/* Metrics */}
      <WarehousesMetrics metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <WarehousesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onCreateWarehouse={handleCreateWarehouse}
      />

      {/* Table */}
      <WarehousesTable
        warehouses={warehouses}
        isLoading={isLoading}
        onViewWarehouse={handleViewWarehouse}
        onConfigureWarehouse={handleConfigureWarehouse}
        onEditWarehouse={handleEditWarehouse}
        onDeleteWarehouse={handleDeleteWarehouse}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Bodega</DialogTitle>
          </DialogHeader>
          <WarehouseForm onSubmit={handleSubmitCreate} mode="create" />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
              onSubmit={handleSubmitEdit}
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
        onClose={() => setIsDetailsModalOpen(false)}
        tenantId={tenantId}
      />

      {/* Delete Modals */}
      {deleteStep === "initial" && (
        <WarehouseDeleteInitialModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onNext={handleDeleteNext}
        />
      )}

      {deleteStep === "warning" && (
        <WarehouseDeleteWarningModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onNext={handleDeleteNext}
          onPrevious={handleDeletePrevious}
        />
      )}

      {deleteStep === "final" && (
        <WarehouseDeleteFinalModal
          warehouse={selectedWarehouse}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onPrevious={handleDeletePrevious}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Service Configuration Modal */}
      <WarehouseServiceConfigModal
        warehouse={selectedWarehouse}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={refreshData}
      />
    </div>
  );
}
