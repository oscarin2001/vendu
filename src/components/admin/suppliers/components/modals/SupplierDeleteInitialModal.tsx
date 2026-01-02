"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Truck } from "lucide-react";
import { Supplier } from "@/services/admin/suppliers/types/supplier.types";

interface SupplierDeleteInitialModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export function SupplierDeleteInitialModal({
  supplier,
  isOpen,
  onClose,
  onNext,
}: SupplierDeleteInitialModalProps) {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Proveedor
          </DialogTitle>
          <DialogDescription>
            <span className="block mb-3">
              ¿Estás seguro de que quieres eliminar al proveedor{" "}
              <span className="font-semibold text-foreground">
                {supplier.fullName}
              </span>
              ?
            </span>
            <span className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Truck className="h-4 w-4" />
              <span className="text-sm">
                <span className="block font-medium">{supplier.fullName}</span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
