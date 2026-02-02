"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SuppliersMetricsGrid } from "@/components/admin/suppliers/metrics";
import { SuppliersFilters } from "@/components/admin/suppliers/shared/components";
import { SuppliersTable } from "@/components/admin/suppliers/tables";
import { SupplierForm } from "@/components/admin/suppliers/forms/SupplierForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupplierDeleteInitialModal, SupplierDeleteWarningModal, SupplierDeleteFinalModal } from "@/components/admin/suppliers/components/modals/deleteModal";
import { SupplierEditFinalModal } from "@/components/admin/suppliers/components/modals/editModal";
import { SupplierServiceConfigModal } from "@/components/admin/suppliers/components/modals/SupplierServiceConfigModal";
import { SupplierStatusToggleModal } from "@/components/admin/suppliers/components/modals/SupplierStatusToggleModal";
import { SupplierDetailsModal } from "@/components/admin/suppliers/components/modals/SupplierDetailsModal";
import { ChangeReasonDialog } from "@/components/admin/shared/dialogs/change-reason";
import { useSuppliers } from "@/services/admin/suppliers";
import { useCompany } from "@/services/admin/company";
import { validateAdminPassword } from "@/services/admin/managers";
import { Supplier } from "@/services/admin/suppliers";
import { toast } from "sonner";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export default function SuppliersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Get company data for country default
  const { company } = useCompany(tenantId);

  // Custom hook for suppliers logic
  const {
    suppliers,
    managers,
    metrics,
    isLoading,
    filters,
    updateSearch,
    updateStatus,
    updateManager,
    clearFilters,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refresh,
  } = useSuppliers(tenantId);

  // Filter change handler
  const handleFiltersChange = (newFilters: any) => {
    updateSearch(newFilters.search || "");
    updateStatus(newFilters.status || "all");
    updateManager(newFilters.managerId);
  };

  // Modal states
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [isDeleteInitialModalOpen, setIsDeleteInitialModalOpen] =
    useState(false);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] =
    useState(false);
  const [isDeleteFinalModalOpen, setIsDeleteFinalModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isStatusToggleModalOpen, setIsStatusToggleModalOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Edit flow states (with change tracking)
  const [isChangeReasonOpen, setIsChangeReasonOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<any>(null);
  const [pendingChanges, setPendingChanges] = useState<FieldChange[]>([]);
  const [pendingEditReason, setPendingEditReason] = useState<string | null>(null);
  const [isEditFinalOpen, setIsEditFinalOpen] = useState(false);
  const [editFinalError, setEditFinalError] = useState<string | undefined>(undefined);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

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

  const handleConfigureSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsConfigureModalOpen(true);
  };

  const handleToggleStatusSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsStatusToggleModalOpen(true);
  };

  const handleStatusToggleConfirm = async (supplierId: number) => {
    setIsTogglingStatus(true);
    try {
      await updateSupplier(supplierId, {
        isActive: !selectedSupplier?.isActive,
      });
      toast.success(
        `Proveedor ${
          selectedSupplier?.isActive ? "desactivado" : "activado"
        } exitosamente`,
      );
      setIsStatusToggleModalOpen(false);
    } catch (error) {
      console.error("Error toggling supplier status:", error);
      toast.error("Error al cambiar el estado del proveedor");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleReloadSuppliers = () => {
    refresh();
  };

  // Edit flow handlers (with change tracking)
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

  const handleCancelChangeReason = () => {
    setIsChangeReasonOpen(false);
    setPendingEditData(null);
    setPendingChanges([]);
  };

  const handleConfirmEditFinal = async (
    password: string,
    overrides?: { isIndefinite?: boolean; contractEndAt?: Date | null }
  ) => {
    if (!pendingEditData || !selectedSupplier) return;
    setIsSubmittingEdit(true);
    try {
      await updateSupplier(selectedSupplier.id, {
        ...pendingEditData,
        ...overrides,
        _changeReason: pendingEditReason,
        _confirmPassword: password,
      });
      setIsEditFinalOpen(false);
      setIsEditModalOpen(false);
      setPendingEditData(null);
      setPendingChanges([]);
      setPendingEditReason(null);
      setEditFinalError(undefined);
      setSelectedSupplier(null);
    } catch (error: any) {
      if (error?.name === "ValidationError") {
        setEditFinalError(error.message || "Error de validación");
        return;
      }
      setEditFinalError(error?.message || "Error al actualizar");
    } finally {
      setIsSubmittingEdit(false);
    }
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
      <SuppliersMetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <SuppliersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
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
        onConfigureService={handleConfigureSupplier}
        onToggleStatus={handleToggleStatusSupplier}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <SupplierForm
            onSubmit={handleCreateSubmit}
            isLoading={isLoading}
            mode="create"
            companyCountry={company?.country}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm
              initialData={{
                firstName: selectedSupplier.firstName,
                lastName: selectedSupplier.lastName,
                ci: selectedSupplier.ci || "",
                phone: selectedSupplier.phone || "",
                email: selectedSupplier.email || "",
                address: selectedSupplier.address || "",
                city: selectedSupplier.city || "",
                department: selectedSupplier.department || "",
                country: selectedSupplier.country || company?.country || "",
                notes: selectedSupplier.notes || "",
                birthDate: selectedSupplier.birthDate,
                partnerSince: selectedSupplier.partnerSince,
                contractEndAt: selectedSupplier.contractEndAt,
                isIndefinite: selectedSupplier.isIndefinite,
              }}
              onEditRequest={handleEditRequest}
              isLoading={isLoading}
              mode="edit"
              companyCountry={company?.country}
              supplierInfo={{
                id: selectedSupplier.id,
                createdAt: selectedSupplier.createdAt,
                updatedAt: selectedSupplier.updatedAt,
                createdBy: selectedSupplier.createdBy,
                updatedBy: selectedSupplier.updatedBy,
              }}
              onCancel={() => setIsEditModalOpen(false)}
              onSubmit={() => {}} // Not used in edit mode
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
        entityName="proveedor"
      />

      {/* Final edit confirmation (name + password) */}
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

      {/* Details Modal */}
      <SupplierDetailsModal
        supplier={selectedSupplier}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

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

      {/* Service Configuration Modal */}
      <SupplierServiceConfigModal
        supplier={selectedSupplier}
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        tenantId={tenantId}
        onSuccess={handleReloadSuppliers}
      />

      {/* Status Toggle Modal */}
      <SupplierStatusToggleModal
        supplier={selectedSupplier}
        isOpen={isStatusToggleModalOpen}
        onClose={() => setIsStatusToggleModalOpen(false)}
        onConfirm={handleStatusToggleConfirm}
        isLoading={isTogglingStatus}
      />
    </div>
  );
}
