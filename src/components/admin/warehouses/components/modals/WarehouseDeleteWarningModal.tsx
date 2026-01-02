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
import {
  AlertTriangle,
  Warehouse,
  Users,
  Package,
  Truck,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseDeleteWarningModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function WarehouseDeleteWarningModal({
  warehouse,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: WarehouseDeleteWarningModalProps) {
  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            ¡Advertencia Importante!
          </DialogTitle>
          <div className="text-muted-foreground text-sm space-y-4">
            <div className="text-red-600 font-medium">
              Esta acción no se puede deshacer. Se eliminará permanentemente:
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <Warehouse className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800">
                    La bodega completa
                  </div>
                  <div className="text-red-700 text-sm">
                    {warehouse.name} y toda su configuración
                  </div>
                </div>
              </div>

              {warehouse.managers && warehouse.managers.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">
                      Asignaciones de gerentes ({warehouse.managers.length})
                    </div>
                    <div className="text-blue-700 text-sm">
                      {warehouse.managers.length === 1
                        ? `${warehouse.managers[0].name} dejará de estar asignado`
                        : `${warehouse.managers.length} gerentes dejarán de estar asignados`
                      }
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <Package className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-800">
                    Inventario y productos
                  </div>
                  <div className="text-orange-700 text-sm">
                    Todos los productos almacenados se perderán
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <Truck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-800">
                    Transferencias
                  </div>
                  <div className="text-purple-700 text-sm">
                    Historial de transferencias a otras sucursales
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="text-gray-800 font-medium mb-1">
                ¿Estás completamente seguro?
              </div>
              <div className="text-gray-600 text-sm">
                Esta acción eliminará permanentemente todos los datos asociados
                a la bodega {warehouse.name}.
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onPrevious}>
            Atrás
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Continuar con eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}