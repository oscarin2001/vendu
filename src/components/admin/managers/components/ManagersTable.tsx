"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  UserCheck,
  UserX,
  Wifi,
  WifiOff,
  Clock,
  HelpCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Manager } from "@/services/admin/managers/types/manager.types";

interface ManagersTableProps {
  managers: Manager[];
  isLoading: boolean;
  onViewDetails: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  onToggleStatus: (manager: Manager) => void;
}

export function ManagersTable({
  managers,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}: ManagersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-1/3"></div>
            </div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (managers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No hay encargados</h3>
          <p>Crea tu primer encargado para comenzar.</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatSalary = (contributionType: string, salary: number) => {
    if (contributionType === "none") {
      return "Sin compensación";
    }
    if (!salary || salary === 0) {
      return "No especificado";
    }
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(salary);
  };

  const getFinancialContribution = (
    contributionType: string,
    salary: number
  ) => {
    if (contributionType === "none") {
      return {
        text: "No recibe compensación",
        variant: "outline" as const,
        icon: null,
        color: "text-gray-600",
      };
    }
    if (contributionType === "contributes") {
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
    <TooltipProvider>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Encargado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Contribución</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Estado Laboral</TableHead>
              <TableHead>Estado Conexión</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(manager.firstName, manager.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{manager.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        CI: {manager.ci}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    Gerente de Sucursal
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {manager.email}
                    </div>
                    {manager.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {manager.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {manager.branches && manager.branches.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {manager.branches.map((branch) => (
                        <Badge
                          key={branch.id}
                          variant="default"
                          className="text-xs"
                        >
                          {branch.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="outline">Sin asignar</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {(() => {
                      const contribution = getFinancialContribution(
                        manager.contributionType,
                        manager.salary
                      );
                      const IconComponent = contribution.icon;
                      return (
                        <Badge
                          variant={contribution.variant}
                          className="text-xs w-fit"
                        >
                          {IconComponent && (
                            <IconComponent
                              className={`w-3 h-3 mr-1 ${contribution.color}`}
                            />
                          )}
                          {contribution.text}
                        </Badge>
                      );
                    })()}
                    <span className="text-xs text-muted-foreground">
                      {formatSalary(manager.contributionType, manager.salary)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(manager.hireDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
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
                      <p className="max-w-xs">
                        {manager.status === "ACTIVE"
                          ? "Trabajando normalmente - Puede acceder al sistema y gestionar sucursales"
                          : manager.status === "DEACTIVATED"
                          ? "Suspendido temporalmente - No puede acceder pero puede reactivarse"
                          : "Salida permanente - Renuncia, despido o jubilación"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs">
                        {manager.connectionStatus === "ONLINE" && (
                          <>
                            <Wifi className="w-3 h-3 mr-1 text-green-500" />
                            Online
                          </>
                        )}
                        {manager.connectionStatus === "OFFLINE" && (
                          <>
                            <WifiOff className="w-3 h-3 mr-1 text-gray-500" />
                            Offline
                          </>
                        )}
                        {manager.connectionStatus === "AWAY" && (
                          <>
                            <Clock className="w-3 h-3 mr-1 text-yellow-500" />
                            Ausente
                          </>
                        )}
                        {manager.connectionStatus === "UNKNOWN" && (
                          <>
                            <HelpCircle className="w-3 h-3 mr-1 text-gray-400" />
                            Desconocido
                          </>
                        )}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {manager.connectionStatus === "ONLINE" &&
                          "Conectado al sistema actualmente"}
                        {manager.connectionStatus === "OFFLINE" &&
                          "No conectado al sistema"}
                        {manager.connectionStatus === "AWAY" &&
                          "Ausente temporalmente"}
                        {manager.connectionStatus === "UNKNOWN" &&
                          "Estado de conexión desconocido"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(manager)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(manager)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(manager)}>
                        {manager.status === "ACTIVE" ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Desactivar
                          </>
                        ) : manager.status === "DEACTIVATED" ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activar
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Cambiar Estado
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(manager)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
