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
import { AlertTriangle, FileText, Users, DollarSign } from "lucide-react";
import { Manager } from "@/services/admin/managers/types/manager.types";

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
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Acceso y permisos
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Se revocarán todos los permisos de encargado
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <FileText className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Historial y registros
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Se perderán registros de actividades y auditoría
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <DollarSign className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Información financiera
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Historial de salarios y pagos asociados
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-md border border-red-300 dark:border-red-700">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Datos Irrecuperables
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                Una vez eliminado, no hay forma de recuperar esta información.
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onPrevious}>
            Atrás
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Entiendo los riesgos, continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
