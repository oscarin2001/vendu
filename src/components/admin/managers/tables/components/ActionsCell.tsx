"use client";

import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
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
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ActionsCellProps {
  manager: Manager;
  onViewDetails: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  onToggleStatus: (manager: Manager) => void;
  onConfigureService: (manager: Manager) => void;
}

export function ActionsCell({
  manager,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onConfigureService,
}: ActionsCellProps) {
  return (
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
            <UserCheck className="h-4 w-4 mr-2" />
            Cambiar Estado
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onConfigureService(manager)}>
            <Building2 className="h-4 w-4 mr-2" />
            Gestionar Sucursales
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
  );
}
