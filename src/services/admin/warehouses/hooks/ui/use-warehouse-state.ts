"use client";

import { useState } from "react";
import { useWarehouseData } from "../data/use-warehouse-data";
import type { WarehouseWithRelations } from "@/services/admin/warehouses/types/entities/warehouse";

/**
 * Hook for managing warehouse UI state
 * @param tenantId - Company/tenant identifier
 * @returns UI state and operations
 */
export function useWarehouseState(tenantId: string) {
  const warehouseData = useWarehouseData(tenantId);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseWithRelations | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * Open create warehouse modal
   */
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * Close create warehouse modal
   */
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  /**
   * Open edit warehouse modal
   */
  const openEditModal = (warehouse: WarehouseWithRelations) => {
    setSelectedWarehouse(warehouse);
    setIsEditModalOpen(true);
  };

  /**
   * Close edit warehouse modal
   */
  const closeEditModal = () => {
    setSelectedWarehouse(null);
    setIsEditModalOpen(false);
  };

  /**
   * Open delete warehouse modal
   */
  const openDeleteModal = (warehouse: WarehouseWithRelations) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteModalOpen(true);
  };

  /**
   * Close delete warehouse modal
   */
  const closeDeleteModal = () => {
    setSelectedWarehouse(null);
    setIsDeleteModalOpen(false);
  };

  return {
    ...warehouseData,
    selectedWarehouse,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  };
}
