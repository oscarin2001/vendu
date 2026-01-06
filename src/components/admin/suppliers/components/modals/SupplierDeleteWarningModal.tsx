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
import { AlertTriangle, FileText, Users, Package, Truck } from "lucide-react";
import { Supplier } from "@/services/admin/suppliers";

interface SupplierDeleteWarningModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function SupplierDeleteWarningModal({
  supplier,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: SupplierDeleteWarningModalProps) {
  if (!supplier) return null;

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
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Información del Proveedor
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Todos los datos personales y de contacto
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Historial de Compras
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Todas las órdenes de compra y transacciones
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <FileText className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Documentos y Notas
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Información adicional y registros asociados
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <Truck className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Relaciones con Encargados
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Asignaciones de encargados a este proveedor
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ Consideraciones importantes:
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>• No podrás recuperar esta información</li>
                <li>• Afectará reportes históricos de compras</li>
                <li>• Los encargados perderán acceso a este proveedor</li>
              </ul>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onPrevious}>
            Atrás
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Entiendo, continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
