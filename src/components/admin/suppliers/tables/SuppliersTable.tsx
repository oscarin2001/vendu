"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck } from "lucide-react";
import { Supplier } from "@/services/admin/suppliers";
import { SuppliersTableSkeleton } from "./components/SuppliersTableSkeleton";
import { SupplierTableRow } from "./components/SupplierTableRow";

interface SuppliersTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onViewDetails: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onConfigureService: (supplier: Supplier) => void;
  onToggleStatus: (supplier: Supplier) => void;
}

export function SuppliersTable({
  suppliers,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onConfigureService,
  onToggleStatus,
}: SuppliersTableProps) {
  if (isLoading) {
    return <SuppliersTableSkeleton />;
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
            <TableHead>Contacto</TableHead>
            <TableHead>Encargado</TableHead>
            <TableHead>Contribución</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <SupplierTableRow
              key={supplier.id}
              supplier={supplier}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onConfigureService={onConfigureService}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
