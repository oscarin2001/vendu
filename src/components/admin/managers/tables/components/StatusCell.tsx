"use client";

import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Manager } from "@/services/admin/managers";

interface StatusCellProps {
  manager: Manager;
}

export function StatusCell({ manager }: StatusCellProps) {
  return (
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
  );
}
