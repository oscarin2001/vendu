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
  Building2,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  Warehouse,
  Hash,
  Mail,
  Globe,
} from "lucide-react";
import { Branch } from "@/services/admin/branches/types/branch.types";

interface BranchDetailsModalProps {
  branch: Branch | null;
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

export function BranchDetailsModal({
  branch,
  isOpen,
  onClose,
}: BranchDetailsModalProps) {
  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">{branch.name}</div>
              <div className="text-sm text-muted-foreground font-mono">
                ID: #{branch.id.toString().padStart(3, "0")}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <Building2 className="h-3 w-3 mr-1" />
              Tienda
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Activa
            </Badge>
          </div>

          <Separator />

          {/* Location & Contact Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-base">Ubicación</h4>
              </div>

              <div className="space-y-3 pl-7">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Dirección</div>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {branch.address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm font-medium">Ciudad</div>
                    <div className="text-sm text-muted-foreground">
                      {branch.city}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Departamento</div>
                    <div className="text-sm text-muted-foreground">
                      {branch.department}
                    </div>
                  </div>
                </div>

                {branch.country && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {branch.country}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Manager Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-base">Contacto & Gerente</h4>
              </div>

              <div className="space-y-3 pl-7">
                {branch.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{branch.phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground italic">
                      Sin teléfono registrado
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm font-medium">Gerentes Asignados</div>
                  {branch.managers && branch.managers.length > 0 ? (
                    <div className="space-y-2">
                      {branch.managers.map((manager) => (
                        <div
                          key={manager.id}
                          className="bg-muted/50 p-3 rounded-lg space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {manager.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {manager.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground italic">
                          Sin gerentes asignados
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Audit Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-base">
                Información de Auditoría
              </h4>
            </div>

            <div className="grid gap-4 md:grid-cols-2 pl-7">
              <div className="space-y-2">
                <div className="text-sm font-medium">Fecha de Creación</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(branch.createdAt)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Última Actualización</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {branch.updatedAt
                    ? formatDate(branch.updatedAt)
                    : "Nunca actualizada"}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {branch.openingHours && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-base">
                    Horarios de Operación
                  </h4>
                </div>
                <div className="pl-7">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(branch.openingHours, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
