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
import { useSuppliers } from "@/services/admin/suppliers/hooks/useSuppliers";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    setIsDeleteModalOpen(true);
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

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;

    setIsDeleting(true);
    try {
      await deleteSupplier(selectedSupplier.id);
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
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

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Proveedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que quieres eliminar a{" "}
              <strong>{selectedSupplier?.fullName}</strong>? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
