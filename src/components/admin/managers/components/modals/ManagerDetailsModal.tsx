"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
                      <p className="text-sm text-muted-foreground">Teléfono</p>
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
                            variant={
                              branch.isWarehouse ? "secondary" : "default"
                            }
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
                    Salario
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatSalary(manager.salary)}
                  </p>
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
                    <Badge variant={manager.isActive ? "default" : "secondary"}>
                      {manager.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                {manager.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Creación
                    </label>
                    <p className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(manager.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
      </DialogContent>
    </Dialog>
  );
}
