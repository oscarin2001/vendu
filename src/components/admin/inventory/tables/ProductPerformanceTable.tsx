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
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ProductPerformance } from "@/services/admin/inventory";

interface ProductPerformanceTableProps {
  productPerformance: ProductPerformance[];
  isLoading: boolean;
}

export function ProductPerformanceTable({ productPerformance, isLoading }: ProductPerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const getPerformanceBadge = (turnoverRate: number) => {
    if (turnoverRate >= 2) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Alta Rotación
        </Badge>
      );
    } else if (turnoverRate >= 1) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Buena Rotación
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          Baja Rotación
        </Badge>
      );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Vendidos</TableHead>
            <TableHead className="text-right">Ingresos</TableHead>
            <TableHead className="text-right">Precio Promedio</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Rotación</TableHead>
            <TableHead>Última Venta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productPerformance.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay datos de rendimiento disponibles
              </TableCell>
            </TableRow>
          ) : (
            productPerformance.map((product) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">{product.productName}</TableCell>
                <TableCell className="text-right">{product.totalSold}</TableCell>
                <TableCell className="text-right">
                  ${product.totalRevenue.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${product.averagePrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{product.stockLevel}</TableCell>
                <TableCell>{getPerformanceBadge(product.turnoverRate)}</TableCell>
                <TableCell>
                  {product.lastSoldDate
                    ? product.lastSoldDate.toLocaleDateString()
                    : "Nunca"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}