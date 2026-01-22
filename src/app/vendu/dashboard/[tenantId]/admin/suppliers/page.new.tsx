"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { SuppliersMetricsGrid } from "@/components/admin/suppliers/metrics";
import { SuppliersFilters } from "@/components/admin/suppliers/shared/components";
import { SuppliersTable } from "@/components/admin/suppliers/tables";
import { SuppliersModals } from "@/components/admin/suppliers/components/modals/SuppliersModals";
import { useSuppliers } from "@/services/admin/suppliers";
import { useCompany } from "@/services/admin/company";
import { validateAdminPassword } from "@/services/admin/managers";
import { Supplier } from "@/services/admin/suppliers";
import { toast } from "sonner";

export default function SuppliersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const { company } = useCompany(tenantId);

  const {
    suppliers,
    managers,
    metrics,
    isLoading,
    filters,
    updateSearch,
    updateStatus,
    updateManager,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refresh,
  } = useSuppliers(tenantId);

  // Modal states
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isStatusToggleModalOpen, setIsStatusToggleModalOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Delete flow states
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3>(1);
  const [isDeleteInitialModalOpen, setIsDeleteInitialModalOpen] =
    useState(false);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] =
    useState(false);
  const [isDeleteFinalModalOpen, setIsDeleteFinalModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter handlers
  const handleFiltersChange = (newFilters: any) => {
    updateSearch(newFilters.search || "");
    updateStatus(newFilters.status || "all");
    updateManager(newFilters.managerId);
  };

  // Modal handlers
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

  const handleCreateSubmit = async (data: any) => {
    try {
      await createSupplier(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedSupplier) return;
    try {
      await updateSupplier(selectedSupplier.id, data);
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleConfirmDelete = async (password: string) => {
    if (!selectedSupplier) return;
    setIsDeleting(true);
    try {
      await validateAdminPassword(tenantId, "", password);
      await deleteSupplier(selectedSupplier.id);
      handleDeleteCancel();
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggleConfirm = async (supplierId: number) => {
    setIsTogglingStatus(true);
    try {
      await updateSupplier(supplierId, {
        isActive: !selectedSupplier?.isActive,
      });
      toast.success(
        `Proveedor ${selectedSupplier?.isActive ? "desactivado" : "activado"}`,
      );
      setIsStatusToggleModalOpen(false);
    } catch (error) {
      toast.error("Error al cambiar estado");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
        <p className="text-muted-foreground">
          Administra todos tus proveedores y sus encargados asignados.
        </p>
      </div>

      <SuppliersMetricsGrid metrics={metrics} isLoading={isLoading} />

      <SuppliersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        managers={managers}
        onCreateSupplier={() => setIsCreateModalOpen(true)}
      />

      <SuppliersTable
        suppliers={suppliers}
        isLoading={isLoading}
        onViewDetails={handleViewSupplier}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        onConfigureService={(s) => {
          setSelectedSupplier(s);
          setIsConfigureModalOpen(true);
        }}
        onToggleStatus={(s) => {
          setSelectedSupplier(s);
          setIsStatusToggleModalOpen(true);
        }}
      />

      <SuppliersModals
        selectedSupplier={selectedSupplier}
        tenantId={tenantId}
        companyCountry={company?.country}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDetailsModalOpen={isDetailsModalOpen}
        isConfigureModalOpen={isConfigureModalOpen}
        isStatusToggleModalOpen={isStatusToggleModalOpen}
        deleteStep={deleteStep}
        isDeleteInitialModalOpen={isDeleteInitialModalOpen}
        isDeleteWarningModalOpen={isDeleteWarningModalOpen}
        isDeleteFinalModalOpen={isDeleteFinalModalOpen}
        isDeleting={isDeleting}
        isTogglingStatus={isTogglingStatus}
        onCreateModalChange={setIsCreateModalOpen}
        onEditModalChange={setIsEditModalOpen}
        onDetailsModalChange={setIsDetailsModalOpen}
        onConfigureModalChange={setIsConfigureModalOpen}
        onStatusToggleModalChange={setIsStatusToggleModalOpen}
        onDeleteNext={handleDeleteNext}
        onDeletePrevious={handleDeletePrevious}
        onDeleteCancel={handleDeleteCancel}
        onSubmitCreate={handleCreateSubmit}
        onSubmitEdit={handleEditSubmit}
        onConfirmDelete={handleConfirmDelete}
        onStatusToggleConfirm={handleStatusToggleConfirm}
        onRefresh={refresh}
      />
    </div>
  );
}
