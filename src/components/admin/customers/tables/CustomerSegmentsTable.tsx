"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerSegment } from "@/services/admin/customers/types";

interface CustomerSegmentsTableProps {
  segments: CustomerSegment[];
  isLoading: boolean;
}

export function CustomerSegmentsTable({ segments, isLoading }: CustomerSegmentsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segmentos de Clientes</CardTitle>
          <CardDescription>Grupos de clientes por comportamiento y valor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segmentos de Clientes</CardTitle>
        <CardDescription>Grupos de clientes por comportamiento y valor</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segmento</TableHead>
              <TableHead>Clientes</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Valor Promedio Orden</TableHead>
              <TableHead>Criterios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((segment) => (
              <TableRow key={segment.id}>
                <TableCell className="font-medium">{segment.name}</TableCell>
                <TableCell>{segment.customerCount}</TableCell>
                <TableCell>${segment.totalValue.toLocaleString()}</TableCell>
                <TableCell>${segment.averageOrderValue.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {segment.criteria.minOrders && (
                      <Badge variant="outline" className="text-xs">
                        ≥{segment.criteria.minOrders} órdenes
                      </Badge>
                    )}
                    {segment.criteria.minSpent && (
                      <Badge variant="outline" className="text-xs">
                        ≥${segment.criteria.minSpent}
                      </Badge>
                    )}
                    {segment.criteria.lastOrderDays && (
                      <Badge variant="outline" className="text-xs">
                        Última orden ≤{segment.criteria.lastOrderDays} días
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}