"use client";

import { ManagerForm } from "@/components/admin/managers/forms/ManagerForm";
import { useCompany } from "@/services/admin/company";
import { ManagerServiceConfigModal } from "./ManagerServiceConfigModal";
import { ManagerDetailsModal } from "./ManagerDetailsModal";
import { ManagerStatusToggleModal } from "./ManagerStatusToggleModal";
import { ManagerDeleteInitialModal } from "./delete/ManagerDeleteInitialModal";
import { ManagerDeleteWarningModal } from "./delete/ManagerDeleteWarningModal";
import { ManagerDeleteFinalModal } from "./delete/ManagerDeleteFinalModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Manager } from "@/services/admin/managers";
import { useState } from "react";

interface ManagersModalsProps {
  selectedManager: Manager | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isConfigureModalOpen: boolean;
  isStatusToggleModalOpen: boolean;
  isDeleteModalOpen: boolean;
  tenantId: string;
  branches: { id: number; name: string }[];
  onCreateModalChange: (open: boolean) => void;
  onEditModalChange: (open: boolean) => void;
  onDetailsModalChange: (open: boolean) => void;
  onConfigureModalChange: (open: boolean) => void;
  onStatusToggleModalChange: (open: boolean) => void;
  onDeleteModalChange: (open: boolean) => void;
  onSubmitCreate: (data: any) => void;
  onSubmitEdit: (data: any) => void;
  onConfirmStatusToggle: (managerId: number) => void;
  onConfirmDelete: (managerId: number, password: string) => void;
  onRefresh: () => void;
}

export function ManagersModals({
  selectedManager,
  isCreateModalOpen,
  isEditModalOpen,
  isDetailsModalOpen,
  isConfigureModalOpen,
  isStatusToggleModalOpen,
  isDeleteModalOpen,
  tenantId,
  branches,
  onCreateModalChange,
  onEditModalChange,
  onDetailsModalChange,
  onConfigureModalChange,
  onStatusToggleModalChange,
  onDeleteModalChange,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmStatusToggle,
  onConfirmDelete,
  onRefresh,
}: ManagersModalsProps) {
  const { company } = useCompany(tenantId);
  const [deleteStep, setDeleteStep] = useState<"initial" | "warning" | "final">(
    "initial",
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleDeleteStart = () => {
    setDeleteStep("initial");
    onDeleteModalChange(true);
  };

  const handleDeleteNext = () => {
    setDeleteStep("warning");
  };

  const handleDeletePrevious = () => {
    if (deleteStep === "warning") {
      setDeleteStep("initial");
    } else if (deleteStep === "final") {
      setDeleteStep("warning");
    }
  };

  const handleDeleteConfirm = async (password: string) => {
    if (!selectedManager) return;

    setIsDeleting(true);
    try {
      await onConfirmDelete(selectedManager.id, password);
      onDeleteModalChange(false);
      setDeleteStep("initial");
    } catch (error) {
      // Error handling will be done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggleConfirm = async (managerId: number) => {
    setIsTogglingStatus(true);
    try {
      await onConfirmStatusToggle(managerId);
      onStatusToggleModalChange(false);
    } catch (error) {
      // Error handling will be done in the parent component
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDeleteClose = () => {
    onDeleteModalChange(false);
    setDeleteStep("initial");
    setIsDeleting(false);
  };
  return (
    <>
      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={onCreateModalChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Encargado</DialogTitle>
          </DialogHeader>
          <ManagerForm
            tenantId={tenantId}
            branches={branches}
            onSubmit={onSubmitCreate}
            mode="create"
            companyCountry={company?.country}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditModalChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Encargado</DialogTitle>
          </DialogHeader>
          {selectedManager && (
            <ManagerForm
              tenantId={tenantId}
              initialData={{
                firstName: selectedManager.firstName,
                lastName: selectedManager.lastName,
                ci: selectedManager.ci,
                phone: selectedManager.phone || "",
                email: selectedManager.email,
                salary: selectedManager.salary,
                branchIds: selectedManager.branches?.map((b) => b.id) || [],
                contributionType: selectedManager.contributionType,
                hireDate: selectedManager.hireDate,
              }}
              branches={branches}
              onSubmit={onSubmitEdit}
              mode="edit"
              companyCountry={company?.country}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <ManagerDetailsModal
        manager={selectedManager}
        isOpen={isDetailsModalOpen}
        onClose={() => onDetailsModalChange(false)}
      />

      {/* Status Toggle Modal */}
      <ManagerStatusToggleModal
        manager={selectedManager}
        isOpen={isStatusToggleModalOpen}
        onClose={() => onStatusToggleModalChange(false)}
        onConfirm={handleStatusToggleConfirm}
        isLoading={isTogglingStatus}
      />

      {/* Configure Modal */}
      <ManagerServiceConfigModal
        manager={selectedManager}
        isOpen={isConfigureModalOpen}
        onClose={() => onConfigureModalChange(false)}
        tenantId={tenantId}
        onSuccess={onRefresh}
      />

      {/* Delete Modals */}
      <ManagerDeleteInitialModal
        manager={selectedManager}
        isOpen={isDeleteModalOpen && deleteStep === "initial"}
        onClose={handleDeleteClose}
        onNext={handleDeleteNext}
      />

      <ManagerDeleteWarningModal
        manager={selectedManager}
        isOpen={isDeleteModalOpen && deleteStep === "warning"}
        onClose={handleDeleteClose}
        onPrevious={handleDeletePrevious}
        onNext={() => setDeleteStep("final")}
      />

      <ManagerDeleteFinalModal
        manager={selectedManager}
        isOpen={isDeleteModalOpen && deleteStep === "final"}
        onClose={handleDeleteClose}
        onPrevious={handleDeletePrevious}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
}
