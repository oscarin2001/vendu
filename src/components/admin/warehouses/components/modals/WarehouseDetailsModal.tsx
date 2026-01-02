"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/Button";
import {
  Warehouse,
  MapPin,
  Phone,
  User,
  Calendar,
  Hash,
  Mail,
  Plus,
  X,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState, useEffect } from "react";
import { getManagersByCompany } from "@/services/admin/managers/services/queries/manager-queries";
import { getBranchesByCompany } from "@/services/admin/branches/branch-service";
import {
  assignManagerToWarehouse,
  removeManagerFromWarehouse,
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "@/services/admin/warehouses/warehouse-service";
import { toast } from "sonner";

interface WarehouseDetailsModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export function WarehouseDetailsModal({
  warehouse,
  isOpen,
  onClose,
  tenantId,
}: WarehouseDetailsModalProps) {
  const [availableManagers, setAvailableManagers] = useState<any[]>([]);
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && warehouse) {
      loadAvailableManagers();
      loadAvailableBranches();
    }
  }, [isOpen, warehouse]);

  const loadAvailableManagers = async () => {
    setIsLoadingManagers(true);
    try {
      const managers = await getManagersByCompany(tenantId);
      // Filter out already assigned managers
      const assignedIds = warehouse?.managers?.map(m => m.id) || [];
      const available = managers.filter(m => !assignedIds.includes(m.id));
      setAvailableManagers(available);
    } catch (error) {
      console.error("Error loading managers:", error);
      toast.error("Error al cargar gerentes");
    } finally {
      setIsLoadingManagers(false);
    }
  };

  const loadAvailableBranches = async () => {
    setIsLoadingBranches(true);
    try {
      const branches = await getBranchesByCompany(tenantId);
      // Filter out already assigned branches
      const assignedIds = warehouse?.branches?.map(b => b.id) || [];
      const available = branches.filter(b => !assignedIds.includes(b.id));
      setAvailableBranches(available);
    } catch (error) {
      console.error("Error loading branches:", error);
      toast.error("Error al cargar sucursales");
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const handleAssignManager = async (managerId: number) => {
    if (!warehouse) return;
    setIsAssigning(true);
    try {
      await assignManagerToWarehouse(tenantId, warehouse.id, managerId);
      toast.success("Gerente asignado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("Error al asignar gerente");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveManager = async (managerId: number) => {
    if (!warehouse) return;
    setIsAssigning(true);
    try {
      await removeManagerFromWarehouse(tenantId, warehouse.id, managerId);
      toast.success("Gerente removido exitosamente");
      onClose();
    } catch (error) {
      console.error("Error removing manager:", error);
      toast.error("Error al remover gerente");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignBranch = async (branchId: number, isPrimary: boolean = false) => {
    if (!warehouse) return;
    setIsAssigning(true);
    try {
      await assignWarehouseToBranch(tenantId, warehouse.id, branchId, isPrimary);
      toast.success("Sucursal asignada exitosamente");
      onClose();
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
      toast.success("Sucursal removida exitosamente");
      onClose();
    } catch (error) {
      console.error("Error removing branch:", error);
      toast.error("Error al remover sucursal");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Warehouse className="h-5 w-5 text-orange-600" />
            </div>
            Detalles de la Bodega
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {warehouse.name}
              </h3>
              <Badge variant="secondary" className="mt-1">
                Bodega
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Información de Contacto
                </h4>

                {warehouse.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {warehouse.address}, {warehouse.city}
                    {warehouse.department && `, ${warehouse.department}`}
                    {warehouse.country && `, ${warehouse.country}`}
                  </span>
                </div>
              </div>

              {/* Manager Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gerente Asignado
                </h4>

                {warehouse.managers && warehouse.managers.length > 0 ? (
                  <div className="space-y-3">
                    {warehouse.managers.map((manager) => (
                      <div key={manager.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{manager.name}</span>
                          </div>
                          {manager.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{manager.email}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveManager(manager.id)}
                          disabled={isAssigning}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No hay gerentes asignados
                  </div>
                )}

                {/* Assign Manager */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Asignar Gerente</h5>
                  {isLoadingManagers ? (
                    <div className="text-sm text-muted-foreground">Cargando...</div>
                  ) : availableManagers.length > 0 ? (
                    <div className="space-y-1">
                      {availableManagers.slice(0, 3).map((manager) => (
                        <Button
                          key={manager.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleAssignManager(manager.id)}
                          disabled={isAssigning}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {manager.name}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No hay gerentes disponibles</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Información del Sistema
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>ID: {warehouse.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Creado: {formatDate(warehouse.createdAt)}</span>
              </div>

              {warehouse.updatedAt && (
                <div className="flex items-center gap-2 col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Última modificación: {formatDate(warehouse.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Branches Served */}
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Sucursales Atendidas ({warehouse.branches?.length || 0})
            </h4>
            {warehouse.branches && warehouse.branches.length > 0 ? (
              <div className="space-y-2">
                {warehouse.branches.map((branch) => (
                  <div key={branch.id} className="flex items-center justify-between p-2 border rounded">
                    <Badge variant={branch.isPrimary ? "default" : "outline"}>
                      {branch.name} {branch.isPrimary && "(Principal)"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBranch(branch.id)}
                      disabled={isAssigning}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No hay sucursales asignadas
              </div>
            )}

            {/* Assign Branch */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Asignar Sucursal</h5>
              {isLoadingBranches ? (
                <div className="text-sm text-muted-foreground">Cargando...</div>
              ) : availableBranches.length > 0 ? (
                <div className="space-y-1">
                  {availableBranches.slice(0, 3).map((branch) => (
                    <div key={branch.id} className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-start"
                        onClick={() => handleAssignBranch(branch.id, false)}
                        disabled={isAssigning}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {branch.name}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignBranch(branch.id, true)}
                        disabled={isAssigning}
                        title="Asignar como principal"
                      >
                        ⭐
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No hay sucursales disponibles</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}