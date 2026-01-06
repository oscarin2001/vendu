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
import type { SalesData } from "@/services/admin/sales";

interface SalesTableProps {
  salesData: SalesData[];
  isLoading: boolean;
}

export function SalesTable({ salesData, isLoading }: SalesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Orden</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Empleado</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No hay datos de ventas disponibles
              </TableCell>
            </TableRow>
          ) : (
            salesData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.orderId}</TableCell>
                <TableCell>{sale.branchId}</TableCell>
                <TableCell>{sale.employeeId}</TableCell>
                <TableCell className="text-right font-medium">
                  ${sale.total.toFixed(2)}
                </TableCell>
                <TableCell>{sale.date.toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
