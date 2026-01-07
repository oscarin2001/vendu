"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, Clock, Package, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Reservation } from "@/services/admin/customers/types";

interface ReservationsProps {
  reservations: Reservation[];
  isLoading: boolean;
}

export function Reservations({ reservations, isLoading }: ReservationsProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "fulfilled":
        return "secondary";
      case "cancelled":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "expired":
        return "Expirada";
      case "fulfilled":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (!dateRange.from || !dateRange.to) return true;

    const expiryDate = new Date(reservation.expiryDate);
    return expiryDate >= dateRange.from && expiryDate <= dateRange.to;
  });

  const activeReservations = filteredReservations.filter(
    (r) => r.status === "active"
  );
  const expiredReservations = filteredReservations.filter(
    (r) => r.status === "expired"
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas de Productos</CardTitle>
          <CardDescription>
            Control de reservas activas y expiradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Reservas de Productos
        </h2>
        <p className="text-muted-foreground">
          Gestión de reservas activas y seguimiento de expiraciones
        </p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Filtrar por Fechas de Expiración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Desde</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-40 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from
                      ? format(dateRange.from, "dd/MM/yyyy")
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, from: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hasta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-40 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to
                      ? format(dateRange.to, "dd/MM/yyyy")
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, to: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Accordion */}
      <TooltipProvider>
        <Accordion type="single" collapsible className="space-y-4">
          {/* Active Reservations */}
          <AccordionItem value="active">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">Reservas Activas</span>
                <Badge variant="default">{activeReservations.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {activeReservations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay reservas activas en el rango de fechas seleccionado
                  </div>
                ) : (
                  activeReservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {reservation.customerName}
                              </h4>
                              <Badge variant="default">Activa</Badge>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-help">
                                  {reservation.productName} -{" "}
                                  {reservation.quantity} unidades
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <p>
                                    <strong>Producto:</strong>{" "}
                                    {reservation.productName}
                                  </p>
                                  <p>
                                    <strong>Cantidad:</strong>{" "}
                                    {reservation.quantity}
                                  </p>
                                  <p>
                                    <strong>Cliente:</strong>{" "}
                                    {reservation.customerName}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Expira:{" "}
                              {reservation.expiryDate.toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Reservado:{" "}
                              {reservation.reservedDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Expired Reservations */}
          <AccordionItem value="expired">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-lg font-semibold">
                  Reservas Expiradas
                </span>
                <Badge variant="destructive">
                  {expiredReservations.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {expiredReservations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay reservas expiradas en el rango de fechas seleccionado
                  </div>
                ) : (
                  expiredReservations.map((reservation) => (
                    <Card key={reservation.id} className="border-red-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {reservation.customerName}
                              </h4>
                              <Badge variant="destructive">Expirada</Badge>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-help">
                                  {reservation.productName} -{" "}
                                  {reservation.quantity} unidades
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <p>
                                    <strong>Producto:</strong>{" "}
                                    {reservation.productName}
                                  </p>
                                  <p>
                                    <strong>Cantidad:</strong>{" "}
                                    {reservation.quantity}
                                  </p>
                                  <p>
                                    <strong>Cliente:</strong>{" "}
                                    {reservation.customerName}
                                  </p>
                                  <p>
                                    <strong>Expiró:</strong>{" "}
                                    {reservation.expiryDate.toLocaleDateString()}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              Expiró:{" "}
                              {reservation.expiryDate.toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Reservado:{" "}
                              {reservation.reservedDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TooltipProvider>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeReservations.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Reservas Activas
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {expiredReservations.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Reservas Expiradas
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  filteredReservations.filter((r) => r.status === "fulfilled")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {
                  filteredReservations.filter((r) => r.status === "cancelled")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Canceladas</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
