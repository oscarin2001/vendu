"use client";

import { TableCell, TableRow } from "@/components/ui/table";
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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  TrendingUp,
  TrendingDown,
  Settings,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Supplier } from "@/services/admin/suppliers";

interface SupplierTableRowProps {
  supplier: Supplier;
  onViewDetails: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onConfigureService: (supplier: Supplier) => void;
  onToggleStatus: (supplier: Supplier) => void;
}

export function SupplierTableRow({
  supplier,
  onViewDetails,
  onEdit,
  onDelete,
  onConfigureService,
  onToggleStatus,
}: SupplierTableRowProps) {
  const getSupplierContribution = (supplier: Supplier) => {
    // Si el proveedor está activo y tiene encargados asignados, está aportando
    if (supplier.isActive && supplier.managers.length > 0) {
      return {
        text: "Aporta",
        variant: "default" as const,
        icon: TrendingUp,
        color: "text-white",
      };
    }
    // Si está activo pero no tiene encargados, no aporta
    if (supplier.isActive && supplier.managers.length === 0) {
      return {
        text: "No aporta",
        variant: "secondary" as const,
        icon: TrendingDown,
        color: "text-gray-600",
      };
    }
    // Si está inactivo, está inactivo
    return {
      text: "Inactivo",
      variant: "outline" as const,
      icon: TrendingDown,
      color: "text-gray-400",
    };
  };

  const contribution = getSupplierContribution(supplier);
  const ContributionIcon = contribution.icon;

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {supplier.firstName[0]}
              {supplier.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{supplier.fullName}</div>
            <div className="text-sm text-muted-foreground">
              {supplier.city && supplier.department && supplier.country
                ? `${supplier.city}, ${supplier.department}, ${supplier.country}`
                : supplier.city && supplier.department
                  ? `${supplier.city}, ${supplier.department}`
                  : supplier.city && supplier.country
                    ? `${supplier.city}, ${supplier.country}`
                    : supplier.department && supplier.country
                      ? `${supplier.department}, ${supplier.country}`
                      : supplier.city ||
                        supplier.department ||
                        supplier.country ||
                        "Sin ubicación"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {supplier.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {supplier.email}
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {supplier.phone}
            </div>
          )}
          {!supplier.email && !supplier.phone && (
            <span className="text-sm text-muted-foreground">Sin contacto</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {supplier.managers.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {supplier.managers.map((manager, index) => (
              <div key={manager.id} className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{manager.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Sin asignar
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={contribution.variant} className="text-xs">
          <ContributionIcon className={`w-3 h-3 mr-1 ${contribution.color}`} />
          {contribution.text}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={supplier.isActive ? "default" : "secondary"}>
          {supplier.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(supplier)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(supplier)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(supplier)}>
              <UserCheck className="h-4 w-4 mr-2" />
              Cambiar Estado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConfigureService(supplier)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Asignar Encargados
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(supplier)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
