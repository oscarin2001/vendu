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
  X,
  Building2,
  Star,
  Shield,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState, useEffect } from "react";
import { WarehouseAuditSection } from "./sections";
import { WarehouseAssignManagerModal, WarehouseAssignBranchModal } from "./assignModal";

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
  const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false);
  const [isAssignBranchModalOpen, setIsAssignBranchModalOpen] = useState(false);

  useEffect(() => {
    // Modal is now read-only, no need to load data for assignments
  }, [isOpen, warehouse]);



  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <Warehouse className="h-5 w-5 text-orange-600 flex-shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-lg font-semibold text-gray-900 truncate"
                title={warehouse.name}
              >
                {warehouse.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  ID: {warehouse.id}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Bodega
                </Badge>
                <Badge variant="default" className="text-xs bg-orange-100 text-orange-800">
                  Activa
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="min-w-0">
              <h3
                className="text-lg font-semibold text-gray-900 truncate"
                title={warehouse.name}
              >
                {warehouse.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  ID: {warehouse.id}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Bodega
                </Badge>
              </div>
            </div>

            <Separator />

            {/* General Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Información General
                </h4>
                <div className="space-y-1 text-sm">
                  {warehouse.openedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-orange-500" />
                      <span className="text-orange-700 font-medium">
                        Abierta desde:
                      </span>
                      <span>{formatDate(warehouse.openedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Creado:</span>
                    <span>{formatDate(warehouse.createdAt)}</span>
                  </div>
                  {warehouse.createdBy && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      Por: {warehouse.createdBy.name}
                    </div>
                  )}
                  {warehouse.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Actualizado:
                      </span>
                      <span>{formatDate(warehouse.updatedAt)}</span>
                    </div>
                  )}
                  {warehouse.updatedBy && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      Por: {warehouse.updatedBy.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Estadísticas y Estado
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {warehouse.branches?.length || 0} sucursales atendidas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {warehouse.managers?.length || 0} gerentes asignados
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {warehouse.branches?.filter((b) => b.isPrimary).length ||
                        0}{" "}
                      sucursales principales,{" "}
                      {warehouse.branches?.filter((b) => !b.isPrimary).length ||
                        0}{" "}
                      sucursales secundarias
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Estado: Activa
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </h4>
                <div className="text-sm">
                  <div className="font-medium">{warehouse.city}</div>
                  {warehouse.department && (
                    <div className="text-muted-foreground">
                      {warehouse.department}
                    </div>
                  )}
                  {warehouse.country && (
                    <div className="text-muted-foreground">
                      {warehouse.country}
                    </div>
                  )}
                  {warehouse.address && (
                    <div className="text-muted-foreground text-xs mt-1">
                      {warehouse.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              {warehouse.phone && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Información de Contacto
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.phone}</span>
                  </div>
                </div>
              )}

              {/* Manager Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Gestión de Personal
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignManagerModalOpen(true)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Asignar Gerente
                  </Button>
                </div>

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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Sin gerente asignado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information - Componente compartido */}
          <WarehouseAuditSection warehouse={warehouse} />

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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {warehouse.branches?.length || 0} asignadas
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignBranchModalOpen(true)}
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  Asignar Sucursal
                </Button>
              </div>
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
                            {branch.isPrimary ? (
                              <Badge
                                variant="default"
                                className="text-xs bg-blue-600"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Bodega Principal
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-400 text-gray-600"
                              >
                                <Building2 className="h-3 w-3 mr-1" />
                                Bodega Secundaria
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{branch.address}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {branch.isPrimary
                                ? "Centro de distribución primario para esta sucursal"
                                : "Centro de distribución secundario de respaldo"}
                            </p>
                          </div>
                        </div>
                      </div>
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
          </div>
        </div>

        {/* Assign Manager Modal */}
        <WarehouseAssignManagerModal
          warehouse={warehouse}
          isOpen={isAssignManagerModalOpen}
          onClose={() => setIsAssignManagerModalOpen(false)}
          tenantId={tenantId}
        />

        {/* Assign Branch Modal */}
        <WarehouseAssignBranchModal
          warehouse={warehouse}
          isOpen={isAssignBranchModalOpen}
          onClose={() => setIsAssignBranchModalOpen(false)}
          tenantId={tenantId}
        />
      </DialogContent>
    </Dialog>
  );
}
