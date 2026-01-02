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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Truck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Supplier } from "@/services/admin/suppliers/types/supplier.types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onViewDetails: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SuppliersTable({
  suppliers,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
}: SuppliersTableProps) {
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
    // Si está inactivo o no tiene encargados, no está contribuyendo activamente
    return {
      text: "Inactivo",
      variant: "secondary" as const,
      icon: TrendingDown,
      color: "text-gray-600",
    };
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/3"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No hay proveedores
        </h3>
        <p className="text-sm text-muted-foreground">
          Comienza creando tu primer proveedor.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Encargado</TableHead>
            <TableHead>Contribución</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
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
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {supplier.supplierNumber}
                </code>
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
                    <span className="text-sm text-muted-foreground">
                      Sin contacto
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {supplier.managers.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    {supplier.managers.map((manager, index) => (
                      <div
                        key={manager.id}
                        className="flex items-center space-x-2"
                      >
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
                {(() => {
                  const contribution = getSupplierContribution(supplier);
                  const IconComponent = contribution.icon;
                  return (
                    <Badge variant={contribution.variant} className="text-xs">
                      <IconComponent
                        className={`w-3 h-3 mr-1 ${contribution.color}`}
                      />
                      {contribution.text}
                    </Badge>
                  );
                })()}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
