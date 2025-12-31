"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ManagerForm } from "../../forms/ManagerForm";
import { Manager } from "@/services/admin/managers/types/manager.types";

interface ManagerEditModalProps {
  tenantId: string;
  manager: Manager | null;
  branches: { id: number; name: string; isWarehouse: boolean }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function ManagerEditModal({
  tenantId,
  manager,
  branches,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ManagerEditModalProps) {
  if (!manager) return null;

  const initialData = {
    firstName: manager.firstName,
    lastName: manager.lastName,
    ci: manager.ci,
    phone: manager.phone || "",
    email: manager.email,
    salary: manager.salary,
    branchIds: manager.branches.map(b => b.id),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Encargado</DialogTitle>
        </DialogHeader>
        <ManagerForm
          tenantId={tenantId}
          initialData={initialData}
          branches={branches}
          onSubmit={onSubmit}
          isLoading={isLoading}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}
