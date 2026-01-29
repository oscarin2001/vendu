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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Users, Warehouse, CheckCircle } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState, useEffect } from "react";
import { getManagersByCompany } from "@/services/admin/managers";
import { assignManagerToWarehouse } from "@/services/admin/warehouses";
import { toast } from "sonner";

interface WarehouseAssignManagerModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
}

export function WarehouseAssignManagerModal({
  warehouse,
  isOpen,
  onClose,
  tenantId,
}: WarehouseAssignManagerModalProps) {
  const [availableManagers, setAvailableManagers] = useState<any[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && warehouse) {
      loadAvailableManagers();
    }
  }, [isOpen, warehouse]);

  const loadAvailableManagers = async () => {
    setIsLoadingManagers(true);
    try {
      const managers = await getManagersByCompany(tenantId);
      // Filter out already assigned managers
      const assignedIds = warehouse?.managers?.map((m) => m.id) || [];
      const available = managers.filter(
        (m: any) => !assignedIds.includes(m.id),
      );
      setAvailableManagers(available);
    } catch (error) {
      console.error("Error al cargar gerentes:", error);
      toast.error("Error al cargar gerentes");
    } finally {
      setIsLoadingManagers(false);
    }
  };

  const handleAssign = async () => {
    if (!warehouse || !selectedManagerId) return;

    setIsAssigning(true);
    try {
      await assignManagerToWarehouse(tenantId, warehouse.id, parseInt(selectedManagerId));
      toast.success("Gerente asignado exitosamente a la bodega");
      onClose();
    } catch (error) {
      console.error("Error al asignar gerente:", error);
      toast.error("Error al asignar gerente");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedManagerId("");
    onClose();
  };

  if (!warehouse) return null;

  const selectedManager = availableManagers.find(m => m.id.toString() === selectedManagerId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            Asignar Gerente a Bodega
          </DialogTitle>
          <DialogDescription>
            Selecciona un gerente para asignarlo a la bodega{" "}
            <span className="font-semibold">{warehouse.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Warehouse Info */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-900">{warehouse.name}</h4>
                <p className="text-sm text-orange-700">
                  {warehouse.city}, {warehouse.department}
                </p>
              </div>
            </div>
          </div>

          {/* Current Managers */}
          {warehouse.managers && warehouse.managers.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Gerentes Actualmente Asignados
              </h4>
              <div className="space-y-2">
                {warehouse.managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="font-medium text-green-900">
                        {manager.name}
                      </span>
                      {manager.email && (
                        <p className="text-sm text-green-700">{manager.email}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Asignado
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}

          {/* Manager Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Seleccionar Gerente Disponible
            </h4>

            {isLoadingManagers ? (
              <div className="text-center py-4 text-gray-500">
                Cargando gerentes disponibles...
              </div>
            ) : availableManagers.length > 0 ? (
              <div className="space-y-3">
                <Select
                  value={selectedManagerId}
                  onValueChange={setSelectedManagerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un gerente" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        {manager.name} - {manager.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedManager && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <span className="font-medium text-blue-900">
                          {selectedManager.name}
                        </span>
                        <p className="text-sm text-blue-700">
                          {selectedManager.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No hay gerentes disponibles para asignar</p>
                <p className="text-xs mt-1">
                  Todos los gerentes ya están asignados a esta bodega
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedManagerId || isAssigning}
          >
            {isAssigning ? "Asignando..." : "Asignar Gerente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}