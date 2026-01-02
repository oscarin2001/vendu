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
  Warehouse,
} from "lucide-react";
import { Branch } from "@/services/admin/branches/types/branch.types";
import { useState, useEffect } from "react";
import { getWarehousesByCompany } from "@/services/admin/warehouses/warehouse-service";
import {
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "@/services/admin/warehouses/warehouse-service";
import { toast } from "sonner";

interface BranchServiceConfigModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

interface Warehouse {
  id: number;
  name: string;
  address: string;
  isPrimary?: boolean;
  isAssigned?: boolean;
}

export function BranchServiceConfigModal({
  branch,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: BranchServiceConfigModalProps) {
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && branch) {
      loadWarehouses();
    }
  }, [isOpen, branch]);

  const loadWarehouses = async () => {
    if (!branch) return;

    setIsLoading(true);
    try {
      const warehouses = await getWarehousesByCompany(tenantId);

      // Marcar cuáles bodegas ya tienen asignada esta sucursal
      const warehousesWithAssignment = warehouses.map((warehouse: any) => {
        const assignedBranch = warehouse.branches?.find(
          (wb: any) => wb.id === branch.id
        );
        return {
          ...warehouse,
          isPrimary: assignedBranch?.isPrimary || false,
          isAssigned: !!assignedBranch,
        };
      });

      setAvailableWarehouses(warehousesWithAssignment);
    } catch (error) {
      console.error("Error loading warehouses:", error);
      toast.error("Error al cargar bodegas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignWarehouse = async (warehouseId: number, isPrimary: boolean) => {
    if (!branch) return;

    setIsAssigning(true);
    try {
      await assignWarehouseToBranch(tenantId, warehouseId, branch.id, isPrimary);
      toast.success(
        isPrimary
          ? "Bodega designada como principal exitosamente"
          : "Bodega agregada como secundaria exitosamente"
      );
      await loadWarehouses();
      onSuccess?.();
    } catch (error) {
      console.error("Error assigning warehouse:", error);
      toast.error("Error al asignar bodega");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveWarehouse = async (warehouseId: number) => {
    if (!branch) return;

    setIsAssigning(true);
    try {
      await removeWarehouseFromBranch(tenantId, warehouseId, branch.id);
      toast.success("Servicio de bodega removido exitosamente");
      await loadWarehouses();
      onSuccess?.();
    } catch (error) {
      console.error("Error removing warehouse:", error);
      toast.error("Error al remover el servicio de bodega");
    } finally {
      setIsAssigning(false);
    }
  };

  const assignedWarehouses = availableWarehouses.filter(
    (warehouse) => warehouse.isAssigned
  );

  const unassignedWarehouses = availableWarehouses.filter(
    (warehouse) => !warehouse.isAssigned
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Warehouse className="h-6 w-6 text-blue-600" />
            Configurar Servicio de Bodegas
          </DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            <strong>{branch?.name}</strong> - Gestiona las bodegas que atenderán esta sucursal
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Resumen de Servicio</h3>
                <p className="text-sm text-gray-600">
                  {assignedWarehouses.length} de {availableWarehouses.length} bodegas asignadas
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {assignedWarehouses.length} activas
              </Badge>
            </div>
          </div>

          {/* Current Service Assignments */}
          {assignedWarehouses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Bodegas Asignadas
              </h4>
              <div className="grid gap-3">
                {assignedWarehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${warehouse.isPrimary ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {warehouse.isPrimary ? (
                          <Star className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Warehouse className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{warehouse.name}</p>
                        <p className="text-sm text-gray-600">{warehouse.address}</p>
                        <Badge variant={warehouse.isPrimary ? "default" : "secondary"} className="text-xs mt-1">
                          {warehouse.isPrimary ? "Bodega Principal" : "Bodega Secundaria"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWarehouse(warehouse.id)}
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

          {/* Available Warehouses */}
          {unassignedWarehouses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Bodegas Disponibles
              </h4>
              <div className="grid gap-3">
                {unassignedWarehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Warehouse className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{warehouse.name}</p>
                        <p className="text-sm text-gray-600">{warehouse.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignWarehouse(warehouse.id, false)}
                        disabled={isAssigning}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Secundaria
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAssignWarehouse(warehouse.id, true)}
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

          {assignedWarehouses.length === 0 && unassignedWarehouses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Warehouse className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay bodegas disponibles para configurar</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}