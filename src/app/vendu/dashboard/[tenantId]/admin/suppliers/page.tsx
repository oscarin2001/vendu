"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SuppliersMetrics } from "@/components/admin/suppliers/components/SuppliersMetrics";
import { SuppliersFilters } from "@/components/admin/suppliers/components/SuppliersFilters";
import { SuppliersTable } from "@/components/admin/suppliers/components/SuppliersTable";
import { SupplierForm } from "@/components/admin/suppliers/forms/SupplierForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupplierDeleteInitialModal } from "@/components/admin/suppliers/components/modals/SupplierDeleteInitialModal";
import { SupplierDeleteWarningModal } from "@/components/admin/suppliers/components/modals/SupplierDeleteWarningModal";
import { SupplierDeleteFinalModal } from "@/components/admin/suppliers/components/modals/SupplierDeleteFinalModal";
import { useSuppliers } from "@/services/admin/suppliers/hooks/useSuppliers";
import { validateAdminPassword } from "@/services/admin/managers/services/mutations/manager-mutations";
import { Supplier } from "@/services/admin/suppliers/types/supplier.types";

export default function SuppliersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Custom hook for suppliers logic
  const {
    suppliers,
    managers,
    metrics,
    isLoading,
    filters,
    setFilters,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers(tenantId);

  // Modal states
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [isDeleteInitialModalOpen, setIsDeleteInitialModalOpen] = useState(false);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] = useState(false);
  const [isDeleteFinalModalOpen, setIsDeleteFinalModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal handlers
  const handleCreateSupplier = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteStep(1);
    setIsDeleteInitialModalOpen(true);
  };

  // Delete flow handlers
  const handleDeleteNext = () => {
    if (deleteStep === 1) {
      setIsDeleteInitialModalOpen(false);
      setIsDeleteWarningModalOpen(true);
      setDeleteStep(2);
    } else if (deleteStep === 2) {
      setIsDeleteWarningModalOpen(false);
      setIsDeleteFinalModalOpen(true);
      setDeleteStep(3);
    }
  };

  const handleDeletePrevious = () => {
    if (deleteStep === 2) {
      setIsDeleteWarningModalOpen(false);
      setIsDeleteInitialModalOpen(true);
      setDeleteStep(1);
    } else if (deleteStep === 3) {
      setIsDeleteFinalModalOpen(false);
      setIsDeleteWarningModalOpen(true);
      setDeleteStep(2);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteInitialModalOpen(false);
    setIsDeleteWarningModalOpen(false);
    setIsDeleteFinalModalOpen(false);
    setSelectedSupplier(null);
    setDeleteStep(1);
  };

  // Form handlers
  const handleCreateSubmit = async (data: any) => {
    try {
      await createSupplier(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedSupplier) return;

    try {
      await updateSupplier(selectedSupplier.id, data);
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteConfirm = async (password: string) => {
    if (!selectedSupplier) return;

    setIsDeleting(true);
    try {
      // Validate admin password first
      await validateAdminPassword(tenantId, "", password);

      // If validation passes, proceed with deletion
      await deleteSupplier(selectedSupplier.id);

      // Close all modals and reset state
      handleDeleteCancel();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
        <p className="text-muted-foreground">
          Administra todos tus proveedores y sus encargados asignados.
        </p>
      </div>

      {/* Metrics */}
      <SuppliersMetrics metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <SuppliersFilters
        filters={filters}
        onFiltersChange={setFilters}
        managers={managers}
        onCreateSupplier={handleCreateSupplier}
      />

      {/* Table */}
      <SuppliersTable
        suppliers={suppliers}
        isLoading={isLoading}
        onViewDetails={handleViewSupplier}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <SupplierForm
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
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm
              initialData={{
                supplierNumber: selectedSupplier.supplierNumber,
                firstName: selectedSupplier.firstName,
                lastName: selectedSupplier.lastName,
                phone: selectedSupplier.phone || "",
                email: selectedSupplier.email || "",
                address: selectedSupplier.address || "",
                city: selectedSupplier.city || "",
                department: selectedSupplier.department || "",
                country: selectedSupplier.country || "",
                notes: selectedSupplier.notes || "",
                managerIds: selectedSupplier.managers.map((m) => m.id),
              }}
              managers={managers}
              onSubmit={handleEditSubmit}
              isLoading={isLoading}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Proveedor</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Número</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.supplierNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre Completo</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.email || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.phone || "No especificado"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ubicación</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.city &&
                    selectedSupplier.department &&
                    selectedSupplier.country
                      ? `${selectedSupplier.city}, ${selectedSupplier.department}, ${selectedSupplier.country}`
                      : selectedSupplier.city && selectedSupplier.department
                      ? `${selectedSupplier.city}, ${selectedSupplier.department}`
                      : selectedSupplier.city && selectedSupplier.country
                      ? `${selectedSupplier.city}, ${selectedSupplier.country}`
                      : selectedSupplier.department && selectedSupplier.country
                      ? `${selectedSupplier.department}, ${selectedSupplier.country}`
                      : selectedSupplier.city ||
                        selectedSupplier.department ||
                        selectedSupplier.country ||
                        "No especificada"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Encargado</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.managers.length > 0
                      ? selectedSupplier.managers.map((m) => m.name).join(", ")
                      : "Sin asignar"}
                  </p>
                </div>
              </div>
              {selectedSupplier.address && (
                <div>
                  <label className="text-sm font-medium">Dirección</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.address}
                  </p>
                </div>
              )}
              {selectedSupplier.notes && (
                <div>
                  <label className="text-sm font-medium">Notas</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSupplier.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modals */}
      <SupplierDeleteInitialModal
        supplier={selectedSupplier}
        isOpen={isDeleteInitialModalOpen}
        onClose={handleDeleteCancel}
        onNext={handleDeleteNext}
      />

      <SupplierDeleteWarningModal
        supplier={selectedSupplier}
        isOpen={isDeleteWarningModalOpen}
        onClose={handleDeleteCancel}
        onNext={handleDeleteNext}
        onPrevious={handleDeletePrevious}
      />

      <SupplierDeleteFinalModal
        supplier={selectedSupplier}
        isOpen={isDeleteFinalModalOpen}
        onClose={handleDeleteCancel}
        onPrevious={handleDeletePrevious}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
