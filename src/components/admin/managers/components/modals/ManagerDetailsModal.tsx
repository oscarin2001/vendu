"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  Calendar,
  Shield,
  FileText,
  Wifi,
  WifiOff,
  Clock,
  HelpCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Manager } from "@/services/admin/managers/types/manager.types";

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(salary);
  };

  const getFinancialContribution = (salary: number) => {
    if (!salary || salary === 0) {
      return {
        text: "Aporta a empresa",
        variant: "default" as const,
        icon: TrendingUp,
        color: "text-white",
      };
    }
    return {
      text: "Empresa aporta",
      variant: "secondary" as const,
      icon: TrendingDown,
      color: "text-gray-600",
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <TooltipProvider>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {getInitials(manager.firstName, manager.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{manager.fullName}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Encargado
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombres
                    </label>
                    <p className="text-lg font-semibold">{manager.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Apellidos
                    </label>
                    <p className="text-lg font-semibold">{manager.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      CI
                    </label>
                    <p className="font-mono">{manager.ci}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Rol
                    </label>
                    <Badge variant="outline">{manager.privilege.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{manager.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Correo electrónico
                      </p>
                    </div>
                  </div>
                  {manager.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{manager.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          Teléfono
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información Laboral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Sucursales Asignadas
                    </label>
                    <div className="mt-1">
                      {manager.branches && manager.branches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {manager.branches.map((branch) => (
                            <Badge
                              key={branch.id}
                              variant="default"
                            >
                              {branch.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline">Sin asignar</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Contribución Financiera
                    </label>
                    <div className="mt-1 space-y-2">
                      {(() => {
                        const contribution = getFinancialContribution(
                          manager.salary
                        );
                        const IconComponent = contribution.icon;
                        return (
                          <Badge variant={contribution.variant}>
                            <IconComponent
                              className={`w-4 h-4 mr-2 ${contribution.color}`}
                            />
                            {contribution.text}
                          </Badge>
                        );
                      })()}
                      <p className="text-sm text-muted-foreground">
                        Salario: {formatSalary(manager.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Contratación
                    </label>
                    <p className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(manager.hireDate).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Auditoría */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información de Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado de la Cuenta
                    </label>
                    <div className="mt-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={
                              manager.status === "ACTIVE"
                                ? "default"
                                : manager.status === "DEACTIVATED"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {manager.status === "ACTIVE"
                              ? "Activo"
                              : manager.status === "DEACTIVATED"
                              ? "Desactivado"
                              : "Inactivo"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-sm">
                            <p className="font-medium mb-1">
                              {manager.status === "ACTIVE"
                                ? "✅ Activo"
                                : manager.status === "DEACTIVATED"
                                ? "🟠 Desactivado"
                                : "🔴 Inactivo"}
                            </p>
                            <p className="text-sm">
                              {manager.status === "ACTIVE"
                                ? "Trabajando normalmente. Puede acceder al sistema y gestionar sucursales."
                                : manager.status === "DEACTIVATED"
                                ? "Suspendido temporalmente. No puede acceder pero puede reactivarse."
                                : "Salida permanente. Renuncia, despido o jubilación."}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground mt-2">
                        {manager.status === "ACTIVE"
                          ? "El encargado puede iniciar sesión y trabajar normalmente."
                          : manager.status === "DEACTIVATED"
                          ? "El encargado está suspendido temporalmente pero puede volver a trabajar."
                          : "El encargado ya no forma parte de la empresa."}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado de Conexión
                    </label>
                    <div className="mt-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline">
                            {manager.connectionStatus === "ONLINE" && (
                              <>
                                <Wifi className="w-4 h-4 mr-2 text-green-500" />
                                Online
                              </>
                            )}
                            {manager.connectionStatus === "OFFLINE" && (
                              <>
                                <WifiOff className="w-4 h-4 mr-2 text-gray-500" />
                                Offline
                              </>
                            )}
                            {manager.connectionStatus === "AWAY" && (
                              <>
                                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                Ausente
                              </>
                            )}
                            {manager.connectionStatus === "UNKNOWN" && (
                              <>
                                <HelpCircle className="w-4 h-4 mr-2 text-gray-400" />
                                Desconocido
                              </>
                            )}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-sm">
                            <p className="font-medium mb-1">
                              {manager.connectionStatus === "ONLINE" &&
                                "Conectado"}
                              {manager.connectionStatus === "OFFLINE" &&
                                "Desconectado"}
                              {manager.connectionStatus === "AWAY" && "Ausente"}
                              {manager.connectionStatus === "UNKNOWN" &&
                                "Desconocido"}
                            </p>
                            <p className="text-sm">
                              {manager.connectionStatus === "ONLINE" &&
                                "Actualmente conectado al sistema"}
                              {manager.connectionStatus === "OFFLINE" &&
                                "No está conectado al sistema"}
                              {manager.connectionStatus === "AWAY" &&
                                "Ausente temporalmente del sistema"}
                              {manager.connectionStatus === "UNKNOWN" &&
                                "Estado de conexión no determinado"}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground mt-2">
                        Estado de conexión actual del encargado
                      </p>
                    </div>
                  </div>
                  {manager.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha de Creación
                      </label>
                      <p className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(manager.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* ID del Encargado */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ID del Encargado</p>
              <p className="text-2xl font-mono font-bold">#{manager.id}</p>
            </div>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
