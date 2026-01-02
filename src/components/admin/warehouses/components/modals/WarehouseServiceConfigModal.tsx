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
  Building2,
  Star,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState, useEffect } from "react";
import { getBranchesByCompany } from "@/services/admin/branches/branch-service";
import {
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "@/services/admin/warehouses";
import { toast } from "sonner";

interface WarehouseServiceConfigModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  isPrimary?: boolean;
}

export function WarehouseServiceConfigModal({
  warehouse,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: WarehouseServiceConfigModalProps) {
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && warehouse) {
      loadBranches();
    }
  }, [isOpen, warehouse]);

  const loadBranches = async () => {
    if (!warehouse) return;

    setIsLoading(true);
    try {
      const branches = await getBranchesByCompany(tenantId);

      // Marcar cuáles sucursales ya están asignadas a esta bodega
      const branchesWithAssignment = branches.map((branch: Branch) => {
        const assignedBranch = warehouse.branches?.find(
          (wb) => wb.id === branch.id
        );
        return {
          ...branch,
          isPrimary: assignedBranch?.isPrimary || false,
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

  const handleAssignBranch = async (branchId: number, isPrimary: boolean) => {
    if (!warehouse) return;

    setIsAssigning(true);
    try {
      await assignWarehouseToBranch(
        tenantId,
        warehouse.id,
        branchId,
        isPrimary
      );
      toast.success(
        isPrimary
          ? "Sucursal designada como bodega principal exitosamente"
          : "Sucursal agregada como bodega secundaria exitosamente"
      );
      await loadBranches();
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning branch:", error);
      toast.error("Error al asignar sucursal");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveBranch = async (branchId: number) => {
    if (!warehouse) return;

    setIsAssigning(true);
    try {
      await removeWarehouseFromBranch(tenantId, warehouse.id, branchId);
      toast.success("Servicio de distribución removido exitosamente");
      await loadBranches();
      onSuccess?.();
    } catch (error) {
      console.error("Error removing branch:", error);
      toast.error("Error al remover el servicio de distribución");
    } finally {
      setIsAssigning(false);
    }
  };

  const assignedBranches = availableBranches.filter((branch) =>
    warehouse?.branches?.some((wb) => wb.id === branch.id)
  );

  const unassignedBranches = availableBranches.filter(
    (branch) => !warehouse?.branches?.some((wb) => wb.id === branch.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            Configurar Servicio de Distribución
          </DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            <strong>{warehouse?.name}</strong> - Gestiona las sucursales que
            atenderá esta bodega
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Resumen de Servicio
                </h3>
                <p className="text-sm text-gray-600">
                  {assignedBranches.length} de {availableBranches.length}{" "}
                  sucursales atendidas
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {assignedBranches.length} activas
              </Badge>
            </div>
          </div>

          {/* Current Service Assignments */}
          {assignedBranches.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Sucursales Atendidas
              </h4>
              <div className="grid gap-3">
                {assignedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          branch.isPrimary ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        {branch.isPrimary ? (
                          <Star className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building2 className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {branch.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {branch.address}
                        </p>
                        <Badge
                          variant={branch.isPrimary ? "default" : "secondary"}
                          className="text-xs mt-1"
                        >
                          {branch.isPrimary
                            ? "Bodega Principal"
                            : "Bodega Secundaria"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBranch(branch.id)}
                      disabled={isAssigning}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Branches */}
          {unassignedBranches.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Sucursales Disponibles
              </h4>
              <div className="grid gap-3">
                {unassignedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {branch.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {branch.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignBranch(branch.id, false)}
                        disabled={isAssigning}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Secundaria
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAssignBranch(branch.id, true)}
                        disabled={isAssigning}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Designar Principal
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedBranches.length === 0 && unassignedBranches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay sucursales disponibles para configurar</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
