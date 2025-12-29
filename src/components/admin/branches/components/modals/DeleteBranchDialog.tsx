"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Building2, Warehouse, User, AlertTriangle } from "lucide-react";
import { Branch } from "@/services/admin/branches/types/branch.types";

interface DeleteBranchDialogProps {
  branch: Branch | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteBranchDialog({
  branch,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteBranchDialogProps) {
  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Eliminar Sucursal</DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                ¿Estás seguro de que quieres eliminar esta sucursal? Esta acción
                no se puede deshacer.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{branch.name}</span>
              <Badge
                variant={branch.isWarehouse ? "secondary" : "default"}
                className={
                  branch.isWarehouse
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }
              >
                {branch.isWarehouse ? (
                  <>
                    <Warehouse className="h-3 w-3 mr-1" />
                    Bodega
                  </>
                ) : (
                  <>
                    <Building2 className="h-3 w-3 mr-1" />
                    Tienda
                  </>
                )}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                {branch.address}, {branch.city}
              </div>
              {branch.manager && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Gerente: {branch.manager.name}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Al eliminar esta sucursal, se
                perderán todos los datos asociados incluyendo empleados
                asignados y configuración específica.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Eliminando..." : "Eliminar Sucursal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
