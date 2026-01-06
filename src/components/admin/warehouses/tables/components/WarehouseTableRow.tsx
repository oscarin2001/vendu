"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Phone,
  Warehouse,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseTableRowProps {
  warehouse: WarehouseType;
  onViewWarehouse: (warehouse: WarehouseType) => void;
  onConfigureWarehouse: (warehouse: WarehouseType) => void;
  onEditWarehouse: (warehouse: WarehouseType) => void;
  onDeleteWarehouse: (warehouse: WarehouseType) => void;
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

export function WarehouseTableRow({
  warehouse,
  onViewWarehouse,
  onConfigureWarehouse,
  onEditWarehouse,
  onDeleteWarehouse,
}: WarehouseTableRowProps) {
  return (
    <TableRow>
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
        {warehouse.managers && warehouse.managers.length > 0 ? (
          <div className="flex flex-col gap-1">
            {warehouse.managers.slice(0, 2).map((manager) => (
              <div key={manager.id} className="flex items-center gap-2">
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
                <div key={branch.id} className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{branch.name}</span>
                  {branch.isPrimary ? (
                    <Badge variant="default" className="text-xs">
                      Primaria
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Secundaria
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewWarehouse(warehouse)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConfigureWarehouse(warehouse)}>
              <Users className="mr-2 h-4 w-4" />
              Gestionar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditWarehouse(warehouse)}>
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
  );
}
