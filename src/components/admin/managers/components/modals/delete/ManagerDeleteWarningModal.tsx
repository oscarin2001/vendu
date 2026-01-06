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
import { AlertTriangle, User, Building2 } from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ManagerDeleteWarningModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ManagerDeleteWarningModal({
  manager,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ManagerDeleteWarningModalProps) {
  if (!manager) return null;

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
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-md border border-red-200">
                <User className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-900">
                    {manager.firstName} {manager.lastName}
                  </div>
                  <div className="text-red-700 text-xs">
                    Encargado - CI: {manager.ci}
                  </div>
                </div>
              </div>

              {manager.branches && manager.branches.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-md border border-orange-200">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">
                      {manager.branches.length} sucursal
                      {manager.branches.length !== 1 ? "es" : ""} asignada
                      {manager.branches.length !== 1 ? "s" : ""}
                    </div>
                    <div className="text-orange-700 text-xs">
                      Se removerá la asignación automáticamente
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Nota:</strong> Si este encargado tiene asignaciones
              activas, se recomienda reasignar sus responsabilidades antes de
              eliminarlo.
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onPrevious}>
            Atrás
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Continuar con Eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
