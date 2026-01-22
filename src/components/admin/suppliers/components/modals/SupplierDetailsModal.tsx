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
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Hash,
  FileText,
  Cake,
  Handshake,
  Clock,
} from "lucide-react";
import { Supplier } from "@/services/admin/suppliers";

interface SupplierDetailsModalProps {
  supplier: Supplier | null;
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

const formatDateOnly = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export function SupplierDetailsModal({
  supplier,
  isOpen,
  onClose,
}: SupplierDetailsModalProps) {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="text-lg block truncate"
                title={supplier.fullName}
              >
                {supplier.fullName}
              </span>
              <Badge
                variant={supplier.isActive ? "default" : "secondary"}
                className="mt-1"
              >
                {supplier.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Información de Contacto
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm pl-6">
              {supplier.ci && (
                <div>
                  <span className="text-muted-foreground">Cédula (CI):</span>{" "}
                  <span className="font-medium">{supplier.ci}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{supplier.phone}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate" title={supplier.email}>
                    {supplier.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Personal & Partnership Information */}
          {(supplier.birthDate || supplier.partnerSince) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Handshake className="h-4 w-4" />
                  Información Personal y de Asociación
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm pl-6">
                  {supplier.birthDate && (
                    <div className="flex items-center gap-2">
                      <Cake className="h-4 w-4 text-pink-500" />
                      <span className="text-muted-foreground">
                        Fecha de Nacimiento:
                      </span>
                      <span className="font-medium">
                        {formatDateOnly(supplier.birthDate)}
                      </span>
                    </div>
                  )}
                  {(supplier.contractEndAt || supplier.isIndefinite) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Fin de contrato:
                      </span>
                      <span className="font-medium">
                        {supplier.contractEndAt
                          ? formatDateOnly(supplier.contractEndAt)
                          : "Tiempo Indefinido"}
                      </span>
                    </div>
                  )}
                  {supplier.partnerSince && (
                    <div className="flex items-center gap-2">
                      <Handshake className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">
                        Socio desde:
                      </span>
                      <span className="font-medium">
                        {formatDateOnly(supplier.partnerSince)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Location Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm pl-6">
              {supplier.address && (
                <div className="col-span-2 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              )}
              {supplier.city && (
                <div>
                  <span className="text-muted-foreground">Ciudad:</span>{" "}
                  {supplier.city}
                </div>
              )}
              {supplier.department && (
                <div>
                  <span className="text-muted-foreground">Departamento:</span>{" "}
                  {supplier.department}
                </div>
              )}
              {supplier.country && (
                <div>
                  <span className="text-muted-foreground">País:</span>{" "}
                  {supplier.country}
                </div>
              )}
            </div>
          </div>

          {supplier.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas
                </h4>
                <p className="text-sm text-muted-foreground pl-6">
                  {supplier.notes}
                </p>
              </div>
            </>
          )}

          {/* Assigned Managers */}
          {supplier.managers && supplier.managers.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gerentes Asignados
                </h4>
                <div className="flex flex-wrap gap-2 pl-6">
                  {supplier.managers.map((manager) => (
                    <Badge key={manager.id} variant="outline">
                      {manager.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* System Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Información del Sistema
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm pl-6">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>ID: {supplier.id}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Creado:</span>
                  <span>{formatDate(supplier.createdAt)}</span>
                </div>
                {supplier.createdBy && (
                  <div className="text-xs text-muted-foreground ml-6">
                    Por: {supplier.createdBy.name}
                  </div>
                )}
              </div>
              {supplier.updatedAt && (
                <div className="space-y-1 col-span-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">
                      Última Modificación:
                    </span>
                    <span>{formatDate(supplier.updatedAt)}</span>
                  </div>
                  {supplier.updatedBy && (
                    <div className="text-xs text-muted-foreground ml-6">
                      Por: {supplier.updatedBy.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
