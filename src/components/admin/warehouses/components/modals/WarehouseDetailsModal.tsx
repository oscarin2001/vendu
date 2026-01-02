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
  Settings,
  Building2,
  Star,
  Shield,
  TrendingUp,
  Users,
  Package,
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
      const assignedIds = warehouse?.managers?.map((m) => m.id) || [];
      const available = managers.filter((m) => !assignedIds.includes(m.id));
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
      const assignedIds = warehouse?.branches?.map((b) => b.id) || [];
      const available = branches.filter((b) => !assignedIds.includes(b.id));
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
      toast.success("Gerente asignado exitosamente a la bodega");
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
      toast.success("Gerente removido de la bodega exitosamente");
      onClose();
    } catch (error) {
      console.error("Error removing manager:", error);
      toast.error("Error al remover gerente");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignBranch = async (
    branchId: number,
    isPrimary: boolean = false
  ) => {
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
      toast.success("Servicio de distribución removido exitosamente");
      onClose();
    } catch (error) {
      console.error("Error removing branch:", error);
      toast.error("Error al remover el servicio de distribución");
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
                  Gestión de Personal
                </h4>

                {warehouse.managers && warehouse.managers.length > 0 ? (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">
                      Gerentes Asignados
                    </h5>
                    {warehouse.managers.map((manager) => (
                      <div
                        key={manager.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {manager.name}
                            </span>
                            {manager.email && (
                              <p className="text-xs text-gray-500">
                                {manager.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveManager(manager.id)}
                          disabled={isAssigning}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Sin gerente asignado</p>
                  </div>
                )}

                {/* Assign Manager */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Asignar Gerente Responsable
                  </h5>
                  {isLoadingManagers ? (
                    <div className="text-sm text-gray-500">
                      Cargando gerentes disponibles...
                    </div>
                  ) : availableManagers.length > 0 ? (
                    <div className="space-y-2">
                      {availableManagers.slice(0, 3).map((manager) => (
                        <Button
                          key={manager.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start p-3 h-auto"
                          onClick={() => handleAssignManager(manager.id)}
                          disabled={isAssigning}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-blue-100 rounded">
                              <Plus className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm">
                                {manager.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Gerente disponible
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Users className="h-6 w-6 mx-auto mb-1 text-gray-300" />
                      <p className="text-xs">No hay gerentes disponibles</p>
                    </div>
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
                  <span>
                    Última modificación: {formatDate(warehouse.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warehouse Overview */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Resumen Operativo
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Centro de distribución con capacidad para atender múltiples
                  puntos de venta
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {warehouse.branches?.length || 0}
                </div>
                <div className="text-xs text-gray-500">Sucursales Activas</div>
              </div>
            </div>
          </div>

          {/* Service Areas Management */}
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Áreas de Servicio Designadas
              </h4>
              <Badge variant="outline" className="text-xs">
                {warehouse.branches?.length || 0} de{" "}
                {availableBranches.length + (warehouse.branches?.length || 0)}{" "}
                disponibles
              </Badge>
            </div>

            {/* Current Service Assignments */}
            {warehouse.branches && warehouse.branches.length > 0 ? (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">
                  Áreas de Servicio Activas
                </h5>
                <div className="grid gap-3">
                  {warehouse.branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
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
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {branch.name}
                            </span>
                            {branch.isPrimary && (
                              <Badge
                                variant="default"
                                className="text-xs bg-blue-600"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Bodega Principal
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {branch.isPrimary
                              ? "Centro de distribución primario para esta sucursal"
                              : "Centro de distribución secundario de respaldo"}
                          </p>
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
                        Remover Servicio
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  Esta bodega no tiene sucursales asignadas
                </p>
                <p className="text-xs mt-1">
                  Configure las áreas de servicio para comenzar
                </p>
              </div>
            )}

            {/* Service Configuration */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración de Servicio
              </h5>

              {isLoadingBranches ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">
                    Cargando sucursales disponibles...
                  </div>
                </div>
              ) : availableBranches.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-3">
                    Seleccione las sucursales que esta bodega atenderá:
                  </p>
                  {availableBranches.slice(0, 5).map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {branch.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          Sucursal disponible para asignación
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignBranch(branch.id, false)}
                          disabled={isAssigning}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Secundaria
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAssignBranch(branch.id, true)}
                          disabled={isAssigning}
                          className="text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Designar Principal
                        </Button>
                      </div>
                    </div>
                  ))}
                  {availableBranches.length > 5 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{availableBranches.length - 5} sucursales adicionales
                      disponibles
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">
                    Todas las sucursales están asignadas
                  </p>
                  <p className="text-xs mt-1">
                    No hay sucursales disponibles para asignar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
