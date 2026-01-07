"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { InventoryData } from "@/services/admin/inventory";

interface InventoryTableProps {
  inventoryData: InventoryData[];
  isLoading: boolean;
}

export function InventoryTable({
  inventoryData,
  isLoading,
}: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const getConditionBadge = (condition: string) => {
    const variants = {
      excellent: "default",
      good: "secondary",
      acceptable: "outline",
      damaged: "destructive",
    } as const;

    const labels = {
      excellent: "Excelente",
      good: "Bueno",
      acceptable: "Aceptable",
      damaged: "Dañado",
    };

    return (
      <Badge
        variant={variants[condition as keyof typeof variants] || "secondary"}
      >
        {labels[condition as keyof typeof labels] || condition}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Producto</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Bodega</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Última Actualización</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No hay datos de inventario disponibles
              </TableCell>
            </TableRow>
          ) : (
            inventoryData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.productVariantId}
                </TableCell>
                <TableCell>{item.branchId}</TableCell>
                <TableCell>{item.warehouseId || "N/A"}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.quantity}
                </TableCell>
                <TableCell>{getConditionBadge(item.condition)}</TableCell>
                <TableCell>{item.lastUpdated.toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
