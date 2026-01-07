"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reservation } from "@/services/admin/customers/types";

interface ReservationsTableProps {
  reservations: Reservation[];
  isLoading: boolean;
}

export function ReservationsTable({ reservations, isLoading }: ReservationsTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'fulfilled': return 'secondary';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Expirada';
      case 'fulfilled': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas de Productos</CardTitle>
          <CardDescription>Productos reservados por clientes</CardDescription>
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
        <CardTitle>Reservas de Productos</CardTitle>
        <CardDescription>Productos reservados por clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Fecha Reserva</TableHead>
              <TableHead>Fecha Expiración</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.customerName}</TableCell>
                <TableCell>{reservation.productName}</TableCell>
                <TableCell>{reservation.quantity}</TableCell>
                <TableCell>{reservation.reservedDate.toLocaleDateString()}</TableCell>
                <TableCell>{reservation.expiryDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}