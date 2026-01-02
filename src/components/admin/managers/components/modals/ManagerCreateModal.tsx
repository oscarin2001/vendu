"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ManagerForm } from "../../forms/ManagerForm";

interface ManagerCreateModalProps {
  tenantId: string;
  branches: { id: number; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function ManagerCreateModal({
  tenantId,
  branches,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ManagerCreateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Encargado de Sucursal</DialogTitle>
        </DialogHeader>
        <ManagerForm
          tenantId={tenantId}
          branches={branches}
          onSubmit={onSubmit}
          isLoading={isLoading}
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );
}
