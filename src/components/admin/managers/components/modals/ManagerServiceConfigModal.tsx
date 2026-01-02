"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  User,
  Star,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Manager } from "@/services/admin/managers/types/manager.types";
import { useState, useEffect } from "react";
import { getBranchesByCompany } from "@/services/admin/branches/branch-service";
import {
  assignBranchToManager,
  removeBranchFromManager,
} from "@/services/admin/managers/services/mutations/manager-mutations";
import { toast } from "sonner";

interface ManagerServiceConfigModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  isAssigned?: boolean;
}

export function ManagerServiceConfigModal({
  manager,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: ManagerServiceConfigModalProps) {
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && manager) {
      loadBranches();
    }
  }, [isOpen, manager]);

  const loadBranches = async () => {
    if (!manager) return;

    setIsLoading(true);
    try {
      const branches = await getBranchesByCompany(tenantId);

      // Marcar cuáles sucursales ya están asignadas a este manager
      const branchesWithAssignment = branches.map((branch: any) => {
        const isAssigned = manager.branches?.some(
          (mb: any) => mb.id === branch.id
        );
        return {
          ...branch,
          isAssigned,
        };
      });

      setAvailableBranches(branchesWithAssignment);
    } catch (error) {
      console.error("Error loading branches:", error);
      toast.error("Error al cargar sucursales");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignBranch = async (branchId: number) => {
    if (!manager) return;

    setIsAssigning(true);
    try {
      // Obtener las sucursales actuales del manager
      const currentBranchIds = manager.branches?.map(b => b.id) || [];

      // Agregar la nueva sucursal
      const newBranchIds = [...currentBranchIds, branchId];

      // Actualizar el manager con las nuevas sucursales
      await assignBranchToManager(tenantId, manager.id, branchId);

      toast.success("Sucursal asignada exitosamente");

      // Actualizar el estado local
      setAvailableBranches(prev =>
        prev.map(branch =>
          branch.id === branchId
            ? { ...branch, isAssigned: true }
            : branch
        )
      );

      // Actualizar el manager prop para que se refleje en la UI
      if (manager.branches) {
        const assignedBranch = availableBranches.find(b => b.id === branchId);
        if (assignedBranch) {
          manager.branches.push({
            id: assignedBranch.id,
            name: assignedBranch.name,
          });
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error assigning branch:", error);
      toast.error("Error al asignar sucursal");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveBranch = async (branchId: number) => {
    if (!manager) return;

    setIsAssigning(true);
    try {
      // Obtener las sucursales actuales del manager
      const currentBranchIds = manager.branches?.map(b => b.id) || [];

      // Remover la sucursal
      const newBranchIds = currentBranchIds.filter(id => id !== branchId);

      // Actualizar el manager con las sucursales restantes
      await removeBranchFromManager(tenantId, manager.id, branchId);

      toast.success("Sucursal removida exitosamente");

      // Actualizar el estado local
      setAvailableBranches(prev =>
        prev.map(branch =>
          branch.id === branchId
            ? { ...branch, isAssigned: false }
            : branch
        )
      );

      // Actualizar el manager prop para que se refleje en la UI
      if (manager.branches) {
        manager.branches = manager.branches.filter(b => b.id !== branchId);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error removing branch:", error);
      toast.error("Error al remover sucursal");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!manager) return null;

  const assignedBranches = availableBranches.filter(branch => branch.isAssigned);
  const unassignedBranches = availableBranches.filter(branch => !branch.isAssigned);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            Configurar Servicio - {manager.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manager Info Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Información del Encargado</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">CI:</span> {manager.ci}
              </div>
              <div>
                <span className="text-gray-600">Email:</span> {manager.email}
              </div>
              <div>
                <span className="text-gray-600">Sucursales Asignadas:</span>{" "}
                <Badge variant="secondary">{assignedBranches.length}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>{" "}
                <Badge
                  variant={
                    manager.status === "ACTIVE"
                      ? "default"
                      : manager.status === "DEACTIVATED"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {manager.status === "ACTIVE"
                    ? "Activo"
                    : manager.status === "DEACTIVATED"
                    ? "Desactivado"
                    : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Assigned Branches */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Sucursales Asignadas ({assignedBranches.length})
            </h3>
            {assignedBranches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay sucursales asignadas</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {assignedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-gray-600">
                          {branch.address}, {branch.city}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBranch(branch.id)}
                      disabled={isAssigning}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Branches */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Sucursales Disponibles ({unassignedBranches.length})
            </h3>
            {unassignedBranches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Todas las sucursales están asignadas</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {unassignedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-gray-600">
                          {branch.address}, {branch.city}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignBranch(branch.id)}
                      disabled={isAssigning}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Asignar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}