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
import { Badge } from "@/components/ui/badge";
import {
  Power,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  UserCheck,
} from "lucide-react";
import { Supplier } from "@/services/admin/suppliers";

interface SupplierStatusToggleModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (supplierId: number) => void;
  isLoading: boolean;
}

export function SupplierStatusToggleModal({
  supplier,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SupplierStatusToggleModalProps) {
  if (!supplier) return null;

  const isCurrentlyActive = supplier.isActive;
  const newStatus = isCurrentlyActive ? false : true;
  const actionText = isCurrentlyActive ? "desactivar" : "activar";

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Activo
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactivo
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Cambiar Estado del Proveedor
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {actionText} a este proveedor? Esta
            acción puede afectar las operaciones relacionadas.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{supplier.fullName}</h4>
                <p className="text-sm text-muted-foreground">
                  {supplier.email || "Sin email"}
                </p>
              </div>
            </div>
            {getStatusBadge(isCurrentlyActive)}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">
                  Estado actual: {isCurrentlyActive ? "Activo" : "Inactivo"}
                </p>
                <p className="text-yellow-700 mt-1">
                  Después de confirmar, el proveedor será{" "}
                  <span className="font-medium">
                    {newStatus ? "activado" : "desactivado"}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(supplier.id)}
            disabled={isLoading}
            className={isCurrentlyActive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isLoading ? (
              "Procesando..."
            ) : (
              <>
                {isCurrentlyActive ? (
                  <XCircle className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {isCurrentlyActive ? "Desactivar" : "Activar"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
