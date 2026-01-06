"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Warehouse, Users } from "lucide-react";
import { Branch } from "@/services/admin/branches";
import { useBranchServiceConfig } from "./hooks";
import {
  ServiceSummary,
  AssignedWarehouses,
  AvailableWarehouses,
  AssignedManager,
  AvailableManagers,
} from "./components";

interface BranchServiceConfigModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onSuccess?: () => void;
}

export function BranchServiceConfigModal({
  branch,
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}: BranchServiceConfigModalProps) {
  const {
    assignedWarehouses,
    availableWarehouses,
    assignedManager,
    availableManagers,
    isLoading,
    isAssigning,
    assignWarehouse,
    removeWarehouse,
    assignManager,
    removeManager,
  } = useBranchServiceConfig({ branch, tenantId, onClose, onSuccess });

  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Warehouse className="h-6 w-6 text-blue-600" />
            Configurar Servicios y Gerente
          </DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            <strong>{branch.name}</strong> - Gestiona las bodegas y designa un
            gerente para esta sucursal
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Manager Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Gerente Asignado</h3>
            </div>

            <AssignedManager
              manager={assignedManager}
              isAssigning={isAssigning}
              onRemove={removeManager}
            />

            {availableManagers.length > 0 && (
              <AvailableManagers
                managers={availableManagers}
                isAssigning={isAssigning}
                onAssign={assignManager}
              />
            )}

            {!assignedManager && availableManagers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No hay gerentes disponibles para asignar</p>
              </div>
            )}
          </div>

          {/* Warehouses Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Bodegas Asignadas</h3>
            </div>

            <ServiceSummary
              assignedCount={assignedWarehouses.length}
              totalCount={
                assignedWarehouses.length + availableWarehouses.length
              }
            />

            <AssignedWarehouses
              warehouses={assignedWarehouses}
              isAssigning={isAssigning}
              onRemove={removeWarehouse}
            />

            <AvailableWarehouses
              warehouses={availableWarehouses}
              isAssigning={isAssigning}
              onAssign={assignWarehouse}
            />

            {assignedWarehouses.length === 0 &&
              availableWarehouses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Warehouse className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay bodegas disponibles para configurar</p>
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
