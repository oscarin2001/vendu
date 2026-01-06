"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Settings,
  Edit,
  Trash2,
  History,
  MapPin,
  User,
  Wrench,
} from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchTableRowProps {
  branch: Branch;
  onViewBranch: (branch: Branch) => void;
  onConfigureBranch: (branch: Branch) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onViewHistory?: (branch: Branch) => void;
}

export function BranchTableRow({
  branch,
  onViewBranch,
  onConfigureBranch,
  onEditBranch,
  onDeleteBranch,
  onViewHistory,
}: BranchTableRowProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{branch.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {branch.city}
          {branch.department && `, ${branch.department}`}
        </div>
      </TableCell>
      <TableCell>
        {branch.manager ? (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{branch.manager.name}</span>
          </div>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Sin gerente
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">Activo</Badge>
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
            <DropdownMenuItem onClick={() => onViewBranch(branch)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConfigureBranch(branch)}>
              <Wrench className="mr-2 h-4 w-4" />
              Gestionar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditBranch(branch)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {onViewHistory && (
              <DropdownMenuItem onClick={() => onViewHistory(branch)}>
                <History className="mr-2 h-4 w-4" />
                Ver historial
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDeleteBranch(branch)}
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
