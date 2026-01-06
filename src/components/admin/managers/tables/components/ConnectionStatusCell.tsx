"use client";

import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wifi, WifiOff, Clock, HelpCircle } from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ConnectionStatusCellProps {
  manager: Manager;
}

export function ConnectionStatusCell({ manager }: ConnectionStatusCellProps) {
  return (
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
            {manager.connectionStatus === "AWAY" && "Ausente temporalmente"}
            {manager.connectionStatus === "UNKNOWN" &&
              "Estado de conexión desconocido"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
}
