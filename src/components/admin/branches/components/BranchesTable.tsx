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
  Truck,
  History,
} from "lucide-react";
import { Branch } from "@/services/admin/branches/types/branch.types";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

interface BranchesTableProps {
  branches: Branch[];
  isLoading: boolean;
  onViewBranch: (branch: Branch) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onViewHistory?: (branch: Branch) => void;
}

export function BranchesTable({
  branches,
  isLoading,
  onViewBranch,
  onEditBranch,
  onDeleteBranch,
  onViewHistory,
}: BranchesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay sucursales</h3>
            <p>
              Crea tu primera sucursal para comenzar a gestionar tu negocio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Gerente</TableHead>
            <TableHead>Proveedores</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-mono text-sm font-medium">
                #{branch.id.toString().padStart(3, "0")}
              </TableCell>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell>
                <Badge
                  variant="default"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  Tienda
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{branch.city}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {branch.department}
                    {branch.country && `, ${branch.country}`}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-32">
                    {branch.address}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {branch.phone ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {branch.phone}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Sin teléfono
                  </span>
                )}
              </TableCell>
              <TableCell>
                {branch.managers && branch.managers.length > 0 ? (
                  <div className="space-y-2">
                    {branch.managers.map((manager, index) => (
                      <div key={manager.id} className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {manager.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {manager.email}
                          </div>
                        </div>
                        {index === 0 && branch.managers.length > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            Principal
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Sin asignar
                  </span>
                )}
              </TableCell>
              <TableCell>
                {branch.suppliers && branch.suppliers.length > 0 ? (
                  <div className="space-y-2">
                    {branch.suppliers.map((supplier, index) => (
                      <div
                        key={supplier.id}
                        className="flex items-center gap-2"
                      >
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {supplier.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            #{supplier.supplierNumber}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Sin asignar
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Activa
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <div>
                  <div>{formatDate(branch.createdAt)}</div>
                  {branch.createdBy && (
                    <div className="text-xs text-muted-foreground mt-1">
                      por {branch.createdBy.name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <div>
                  <div>
                    {branch.updatedAt ? formatDate(branch.updatedAt) : "Nunca"}
                  </div>
                  {branch.updatedBy && (
                    <div className="text-xs text-muted-foreground mt-1">
                      por {branch.updatedBy.name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewBranch(branch)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    {onViewHistory && (
                      <DropdownMenuItem onClick={() => onViewHistory(branch)}>
                        <History className="h-4 w-4 mr-2" />
                        Ver historial
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEditBranch(branch)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteBranch(branch)}
                      className="text-red-600 focus:text-red-600"
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
