"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Warehouse,
  MapPin,
  Phone,
  User,
  Calendar,
  Hash,
  Mail,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseDetailsModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
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
}: WarehouseDetailsModalProps) {
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
                      <div key={manager.id} className="space-y-2">
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
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No hay gerentes asignados
                  </div>
                )}
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
          {warehouse.branches && warehouse.branches.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Sucursales Atendidas ({warehouse.branches.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {warehouse.branches.map((branch) => (
                    <Badge key={branch.id} variant={branch.isPrimary ? "default" : "outline"}>
                      {branch.name} {branch.isPrimary && "(Principal)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}