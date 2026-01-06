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
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ManagerStatusToggleModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (managerId: number) => void;
  isLoading: boolean;
}

export function ManagerStatusToggleModal({
  manager,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ManagerStatusToggleModalProps) {
  if (!manager) return null;

  const isCurrentlyActive = manager.status === "ACTIVE";
  const newStatus = isCurrentlyActive ? "DEACTIVATED" : "ACTIVE";
  const actionText = isCurrentlyActive ? "desactivar" : "activar";

  const getStatusBadge = (status: Manager["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        );
      case "DEACTIVATED":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Desactivado
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Inactivo
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleConfirm = () => {
    onConfirm(manager.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCurrentlyActive ? (
              <UserX className="h-5 w-5 text-orange-500" />
            ) : (
              <UserCheck className="h-5 w-5 text-green-500" />
            )}
            {isCurrentlyActive ? "Desactivar" : "Activar"} Encargado
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {actionText} a {manager.fullName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del Manager */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{manager.fullName}</h4>
              <p className="text-sm text-muted-foreground">{manager.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  Estado actual:
                </span>
                {getStatusBadge(manager.status)}
              </div>
            </div>
          </div>

          {/* Cambio de Estado */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Cambio de Estado</h4>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm">Estado actual:</span>
                {getStatusBadge(manager.status)}
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Nuevo estado:</span>
                {getStatusBadge(newStatus)}
              </div>
            </div>
          </div>

          {/* Consecuencias */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Consecuencias del cambio
            </h4>

            {isCurrentlyActive ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>El encargado perderá acceso al sistema</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>No podrá gestionar las sucursales asignadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Los usuarios de sus sucursales podrán seguir operando
                    normalmente
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    El encargado recuperará acceso completo al sistema
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Podrá gestionar nuevamente las sucursales asignadas
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Recuperará todos sus privilegios administrativos</span>
                </div>
              </div>
            )}
          </div>

          {/* Sucursales Afectadas */}
          {manager.branches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sucursales asignadas ({manager.branches.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {manager.branches.map((branch) => (
                  <Badge key={branch.id} variant="outline" className="text-xs">
                    {branch.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={isCurrentlyActive ? "destructive" : "default"}
          >
            {isLoading ? (
              "Procesando..."
            ) : (
              <>
                {isCurrentlyActive ? (
                  <UserX className="h-4 w-4 mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                {isCurrentlyActive ? "Desactivar" : "Activar"} Encargado
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
