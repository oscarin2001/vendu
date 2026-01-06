"use client";

import { WarehousesMetricsGrid } from "@/components/admin/warehouses/metrics";
import { WarehousesFilters } from "@/components/admin/warehouses/shared/components";
import { WarehousesTable } from "@/components/admin/warehouses/tables";
import { WarehousesModals } from "@/components/admin/warehouses/components";
import { useWarehouses } from "@/services/admin/warehouses/utils/hooks/use-warehouses";
import { useWarehouseHandlers } from "@/components/admin/warehouses/hooks/useWarehouseHandlers";

interface WarehousesPageContentProps {
  tenantId: string;
}

export function WarehousesPageContent({
  tenantId,
}: WarehousesPageContentProps) {
  // Custom hook for warehouses logic
  const {
    warehouses,
    metrics,
    isLoading,
    filters,
    updateSearch,
    updateStatus,
    clearFilters,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    refresh,
  } = useWarehouses(tenantId);

  // Custom hook for modal and handler logic
  const {
    selectedWarehouse,
    isCreateModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isConfigureModalOpen,
    deleteStep,
    isDeleteModalOpen,
    isDeleting,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDetailsModalOpen,
    setIsConfigureModalOpen,
    setIsDeleteModalOpen,
    handleCreateWarehouse,
    handleViewWarehouse,
    handleEditWarehouse,
    handleConfigureWarehouse,
    handleDeleteWarehouse,
    handleDeleteNext,
    handleDeletePrevious,
    handleConfirmDelete,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitEdit,
  } = useWarehouseHandlers({
    tenantId,
    refresh,
  });

  // Wrapper function for filters change
  const handleFiltersChange = (newFilters: {
    search: string;
    status: "all" | "withManager" | "withoutManager";
  }) => {
    updateSearch(newFilters.search);
    updateStatus(newFilters.status);
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
      <WarehousesMetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* Filters */}
      <WarehousesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
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

      <WarehousesModals
        selectedWarehouse={selectedWarehouse}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDetailsModalOpen={isDetailsModalOpen}
        isConfigureModalOpen={isConfigureModalOpen}
        deleteStep={deleteStep}
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        tenantId={tenantId}
        onCreateModalChange={setIsCreateModalOpen}
        onEditModalChange={setIsEditModalOpen}
        onDetailsModalChange={setIsDetailsModalOpen}
        onConfigureModalChange={setIsConfigureModalOpen}
        onDeleteModalChange={setIsDeleteModalOpen}
        onDeleteNext={handleDeleteNext}
        onDeletePrevious={handleDeletePrevious}
        onConfirmDelete={handleConfirmDelete}
        onCloseModals={handleCloseModals}
        onSubmitCreate={handleSubmitCreate}
        onSubmitEdit={handleSubmitEdit}
        onRefresh={refresh}
      />
    </div>
  );
}
