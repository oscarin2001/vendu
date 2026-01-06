"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Warehouse } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { WarehousesTableSkeleton } from "./components/WarehousesTableSkeleton";
import { WarehouseTableRow } from "./components/WarehouseTableRow";

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
    return <WarehousesTableSkeleton />;
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
              <TableHead>Gerente</TableHead>
              <TableHead className="flex items-center gap-2">
                Áreas de Servicio
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Una bodega puede atender múltiples sucursales.</p>
                    <p>
                      La sucursal designada como "Principal" recibe prioridad en
                      el servicio.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <WarehouseTableRow
                key={warehouse.id}
                warehouse={warehouse}
                onViewWarehouse={onViewWarehouse}
                onConfigureWarehouse={onConfigureWarehouse}
                onEditWarehouse={onEditWarehouse}
                onDeleteWarehouse={onDeleteWarehouse}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
