"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  Building2,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Cake,
  MapPin,
  CalendarClock,
  CalendarX,
} from "lucide-react";
import { Manager } from "@/services/admin/managers";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ManagerDetailsModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ManagerDetailsModal({
  manager,
  isOpen,
  onClose,
}: ManagerDetailsModalProps) {
  if (!manager) return null;

  const getStatusBadge = (status: Manager["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        );
      case "DEACTIVATED":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Desactivado
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Inactivo
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConnectionStatusBadge = (status: Manager["connectionStatus"]) => {
    switch (status) {
      case "ONLINE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            En línea
          </Badge>
        );
      case "OFFLINE":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
            Fuera de línea
          </Badge>
        );
      case "AWAY":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
            Ausente
          </Badge>
        );
      case "UNKNOWN":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
            Desconocido
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContributionTypeLabel = (type: Manager["contributionType"]) => {
    switch (type) {
      case "none":
        return "Sin contribución";
      case "contributes":
        return "Contribuyente";
      case "paid":
        return "Pagado";
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 flex-shrink-0" />
            Detalles del Encargado
          </DialogTitle>
          <DialogDescription
            className="truncate"
            title={`Información completa del encargado ${manager.fullName}`}
          >
            Información completa del encargado {manager.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre Completo
                </label>
                <p
                  className="text-sm font-medium truncate"
                  title={manager.fullName}
                >
                  {manager.fullName}
                </p>
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Cédula de Identidad
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{manager.ci}</span>
                </p>
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Correo Electrónico
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate" title={manager.email}>
                    {manager.email}
                  </span>
                </p>
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {manager.phone || "No especificado"}
                  </span>
                </p>
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Nacimiento
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Cake className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {manager.birthDate
                      ? format(manager.birthDate, "PPP", { locale: es })
                      : "No especificada"}
                  </span>
                </p>
              </div>
              <div className="space-y-2 min-w-0">
                <label className="text-sm font-medium text-muted-foreground">
                  Dirección Particular
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {manager.homeAddress || "No especificada"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Información Laboral
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Desde Cuándo Trabaja
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  {manager.joinedAt
                    ? format(manager.joinedAt, "PPP", { locale: es })
                    : "No especificada"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Hasta Cuándo (Fin Contrato)
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CalendarX className="h-4 w-4" />
                  {manager.contractEndAt
                    ? format(manager.contractEndAt, "PPP", { locale: es })
                    : "Tiempo Indefinido"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Salario
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {manager.salary.toLocaleString("es-BO", {
                    style: "currency",
                    currency: "BOB",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Contratación
                </label>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(manager.hireDate, "PPP", { locale: es })}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo de Contrato
                </label>
                <p className="text-sm font-medium">{manager.contractType}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo de Contribución
                </label>
                <p className="text-sm font-medium">
                  {getContributionTypeLabel(manager.contributionType)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado y Privilegios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Estado y Privilegios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Estado de la Cuenta
                </label>
                <div>{getStatusBadge(manager.status)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Estado de Conexión
                </label>
                <div>{getConnectionStatusBadge(manager.connectionStatus)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Privilegio
                </label>
                <p className="text-sm font-medium">{manager.privilege.name}</p>
                <p className="text-xs text-muted-foreground">
                  Código: {manager.privilege.code}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Activo
                </label>
                <div className="flex items-center gap-2">
                  {manager.isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {manager.isActive ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sucursales Asignadas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sucursales Asignadas
            </h3>

            {manager.branches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {manager.branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {branch.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hay sucursales asignadas</p>
              </div>
            )}
          </div>

          {/* Información de Creación */}
          {(manager.createdAt || manager.updatedAt) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Información del Sistema
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {manager.createdAt && (
                    <div>
                      <p className="text-muted-foreground">Creado</p>
                      <p className="font-medium">
                        {format(manager.createdAt, "PPP 'a las' p", {
                          locale: es,
                        })}
                      </p>
                      {manager.createdBy && (
                        <p className="text-xs text-muted-foreground">
                          por {manager.createdBy.name}
                        </p>
                      )}
                    </div>
                  )}
                  {manager.updatedAt && (
                    <div>
                      <p className="text-muted-foreground">
                        Última actualización
                      </p>
                      <p className="font-medium">
                        {format(manager.updatedAt, "PPP 'a las' p", {
                          locale: es,
                        })}
                      </p>
                      {manager.updatedBy && (
                        <p className="text-xs text-muted-foreground">
                          por {manager.updatedBy.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
