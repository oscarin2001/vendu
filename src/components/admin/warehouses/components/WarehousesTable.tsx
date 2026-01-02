"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  User,
  Phone,
  Warehouse,
  Info,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

interface WarehousesTableProps {
  warehouses: WarehouseType[];
  isLoading: boolean;
  onViewWarehouse: (warehouse: WarehouseType) => void;
  onConfigureWarehouse: (warehouse: WarehouseType) => void;
  onEditWarehouse: (warehouse: WarehouseType) => void;
  onDeleteWarehouse: (warehouse: WarehouseType) => void;
}

export function WarehousesTable({
  warehouses,
  isLoading,
  onViewWarehouse,
  onConfigureWarehouse,
  onEditWarehouse,
  onDeleteWarehouse,
}: WarehousesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className="text-center py-12">
        <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay bodegas
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primera bodega.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead className="flex items-center gap-2">
                Áreas de Servicio
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Una bodega puede atender múltiples sucursales.</p>
                    <p>La sucursal designada como "Principal" recibe prioridad en el servicio.</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-orange-600" />
                    {warehouse.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {warehouse.city}
                    {warehouse.department && `, ${warehouse.department}`}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {warehouse.country || "No especificado"}
                  </span>
                </TableCell>
                <TableCell>
                  {warehouse.managers && warehouse.managers.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {warehouse.managers.slice(0, 2).map((manager) => (
                        <div
                          key={manager.id}
                          className="flex items-center gap-2"
                        >
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{manager.name}</span>
                        </div>
                      ))}
                      {warehouse.managers.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{warehouse.managers.length - 2} más
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Sin gerente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {warehouse.branches && warehouse.branches.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {warehouse.branches.length} área
                          {warehouse.branches.length !== 1 ? "s" : ""} de servicio
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1">
                        {warehouse.branches.slice(0, 2).map((branch) => (
                          <div
                            key={branch.id}
                            className="flex items-center gap-2"
                          >
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{branch.name}</span>
                            {branch.isPrimary && (
                              <Badge variant="default" className="text-xs">
                                Primaria
                              </Badge>
                            )}
                          </div>
                        ))}
                        {warehouse.branches.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{warehouse.branches.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Sin áreas asignadas
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {warehouse.phone ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {warehouse.phone}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(warehouse.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onViewWarehouse(warehouse)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onConfigureWarehouse(warehouse)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar Servicio
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEditWarehouse(warehouse)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteWarehouse(warehouse)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
