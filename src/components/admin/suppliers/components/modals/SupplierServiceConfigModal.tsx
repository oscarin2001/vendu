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
  Truck,
} from "lucide-react";
import { Supplier } from "@/services/admin/suppliers/types/supplier.types";
import { useState, useEffect } from "react";
import { getManagersByCompany } from "@/services/admin/managers/services/queries/manager-queries";
import {
  assignManagerToSupplier,
  removeManagerFromSupplier,
} from "@/services/admin/suppliers/services/mutations/supplier-mutations";
import { toast } from "sonner";

interface SupplierServiceConfigModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  isAssigned?: boolean;
}

export function SupplierServiceConfigModal({
  supplier,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: SupplierServiceConfigModalProps) {
  const [availableManagers, setAvailableManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && supplier) {
      loadManagers();
    }
  }, [isOpen, supplier]);

  const loadManagers = async () => {
    if (!supplier) return;

    setIsLoading(true);
    try {
      const managers = await getManagersByCompany(tenantId);

      // Marcar cuáles managers ya están asignados a este supplier
      const managersWithAssignment = managers.map((manager: any) => {
        const isAssigned = supplier.managers?.some(
          (sm: any) => sm.id === manager.id
        );
        return {
          ...manager,
          isAssigned,
        };
      });

      setAvailableManagers(managersWithAssignment);
    } catch (error) {
      console.error("Error loading managers:", error);
      toast.error("Error al cargar encargados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignManager = async (managerId: number) => {
    if (!supplier) return;

    setIsAssigning(true);
    try {
      // Obtener los managers actuales del supplier
      const currentManagerIds = supplier.managers?.map(m => m.id) || [];

      // Agregar el nuevo manager
      const newManagerIds = [...currentManagerIds, managerId];

      // Actualizar el supplier con los nuevos managers
      await assignManagerToSupplier(tenantId, supplier.id, managerId);

      toast.success("Encargado asignado exitosamente");

      // Actualizar el estado local
      setAvailableManagers(prev =>
        prev.map(manager =>
          manager.id === managerId
            ? { ...manager, isAssigned: true }
            : manager
        )
      );

      // Actualizar el supplier prop para que se refleje en la UI
      if (supplier.managers) {
        const assignedManager = availableManagers.find(m => m.id === managerId);
        if (assignedManager) {
          supplier.managers.push({
            id: assignedManager.id,
            name: assignedManager.name,
            email: assignedManager.email,
          });
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("Error al asignar encargado");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveManager = async (managerId: number) => {
    if (!supplier) return;

    setIsAssigning(true);
    try {
      // Obtener los managers actuales del supplier
      const currentManagerIds = supplier.managers?.map(m => m.id) || [];

      // Remover el manager
      const newManagerIds = currentManagerIds.filter(id => id !== managerId);

      // Actualizar el supplier con los managers restantes
      await removeManagerFromSupplier(tenantId, supplier.id, managerId);

      toast.success("Encargado removido exitosamente");

      // Actualizar el estado local
      setAvailableManagers(prev =>
        prev.map(manager =>
          manager.id === managerId
            ? { ...manager, isAssigned: false }
            : manager
        )
      );

      // Actualizar el supplier prop para que se refleje en la UI
      if (supplier.managers) {
        supplier.managers = supplier.managers.filter(m => m.id !== managerId);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error removing manager:", error);
      toast.error("Error al remover encargado");
    } finally {
      setIsAssigning(false);
    }
  };

  // Función auxiliar para actualizar los managers del supplier
  const updateSupplierManagers = async (supplierId: number, managerIds: number[]) => {
    const response = await fetch(`/api/admin/suppliers/${supplierId}/managers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ managerIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to update supplier managers');
    }

    return response.json();
  };

  if (!supplier) return null;

  const assignedManagers = availableManagers.filter(manager => manager.isAssigned);
  const unassignedManagers = availableManagers.filter(manager => !manager.isAssigned);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-600" />
            Configurar Servicio - {supplier.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Info Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium">Información del Proveedor</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Código:</span> {supplier.supplierNumber}
              </div>
              <div>
                <span className="text-gray-600">Email:</span> {supplier.email || 'No especificado'}
              </div>
              <div>
                <span className="text-gray-600">Encargados Asignados:</span>{" "}
                <Badge variant="secondary">{assignedManagers.length}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>{" "}
                <Badge
                  variant={supplier.isActive ? "default" : "secondary"}
                >
                  {supplier.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Assigned Managers */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Encargados Asignados ({assignedManagers.length})
            </h3>
            {assignedManagers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay encargados asignados</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {assignedManagers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{manager.name}</div>
                        <div className="text-sm text-gray-600">
                          {manager.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveManager(manager.id)}
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

          {/* Available Managers */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Encargados Disponibles ({unassignedManagers.length})
            </h3>
            {unassignedManagers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Todos los encargados están asignados</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {unassignedManagers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{manager.name}</div>
                        <div className="text-sm text-gray-600">
                          {manager.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignManager(manager.id)}
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