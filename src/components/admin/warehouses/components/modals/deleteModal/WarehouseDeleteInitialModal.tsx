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
import { AlertTriangle, Warehouse, User } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseDeleteInitialModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export function WarehouseDeleteInitialModal({
  warehouse,
  isOpen,
  onClose,
  onNext,
}: WarehouseDeleteInitialModalProps) {
  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Bodega
          </DialogTitle>
          <DialogDescription>
            <span className="block mb-3">
              ¿Estás seguro de que quieres eliminar la bodega{" "}
              <span className="font-semibold text-foreground">
                {warehouse.name}
              </span>
              ?
            </span>
            <span className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Warehouse className="h-4 w-4" />
              <span className="text-sm">
                <span className="block font-medium">{warehouse.name}</span>
                <span className="block text-muted-foreground">
                  {warehouse.city}
                  {warehouse.department && `, ${warehouse.department}`}
                </span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  Esta acción no se puede deshacer
                </p>
                <p className="text-amber-700 mt-1">
                  Se eliminará permanentemente la bodega y toda su información
                  asociada.
                </p>
              </div>
            </div>
          </div>

          {warehouse.managers && warehouse.managers.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">
                    Gerentes asignados ({warehouse.managers.length})
                  </p>
                  <p className="text-blue-700 mt-1">
                    {warehouse.managers.length === 1
                      ? `${warehouse.managers[0].name} está asignado a esta bodega.`
                      : `${warehouse.managers.length} gerentes están asignados a esta bodega.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

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