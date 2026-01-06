import { useState } from "react";
import { Warehouse } from "@/services/admin/warehouses/types/warehouse.types";
import { useWarehouseOperations } from "@/services/admin/warehouses/utils/hooks/use-warehouse-operations";

interface UseWarehouseHandlersProps {
  tenantId: string;
  refresh: () => void;
}

export function useWarehouseHandlers({
  tenantId,
  refresh,
}: UseWarehouseHandlersProps) {
  const { createWarehouse, updateWarehouse, deleteWarehouse } =
    useWarehouseOperations(tenantId, refresh);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"initial" | "warning" | "final">(
    "initial"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

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
      const userContext = {
        employeeId: 1,
        companyId: 1,
        ipAddress: "127.0.0.1",
        userAgent: "Mock User Agent",
      };

      await deleteWarehouse(selectedWarehouse.id, password, userContext);
      setIsDeleteModalOpen(false);
      setSelectedWarehouse(null);
      setAdminPassword("");
      refresh();
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
      refresh();
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
      refresh();
    } catch (error) {
      console.error("Error updating warehouse:", error);
      throw error;
    }
  };

  return {
    selectedWarehouse,
    isCreateModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isConfigureModalOpen,
    deleteStep,
    isDeleteModalOpen,
    isDeleting,
    adminPassword,
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
  };
}
