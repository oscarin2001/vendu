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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Eye,
  ArrowRight,
  ArrowLeft,
  Minus,
  CalendarIcon,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import {
  WarehouseMovement,
  WarehouseFilters,
} from "@/services/admin/warehouses-logistics/types";

interface WarehouseMovementsTableProps {
  movements: WarehouseMovement[];
  filters: WarehouseFilters;
  isLoading: boolean;
  onFiltersChange: (filters: Partial<WarehouseFilters>) => void;
}

export function WarehouseMovementsTable({
  movements,
  filters,
  isLoading,
  onFiltersChange,
}: WarehouseMovementsTableProps) {
  const [selectedMovement, setSelectedMovement] =
    useState<WarehouseMovement | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "entry":
        return <ArrowRight className="h-4 w-4 text-green-600" />;
      case "transfer":
        return <ArrowLeft className="h-4 w-4 text-blue-600" />;
      case "adjustment":
        return <Minus className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMovementBadgeVariant = (type: string) => {
    switch (type) {
      case "entry":
        return "default";
      case "transfer":
        return "secondary";
      case "adjustment":
        return "outline";
      default:
        return "outline";
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case "entry":
        return "Entrada";
      case "transfer":
        return "Transferencia";
      case "adjustment":
        return "Ajuste";
      default:
        return type;
    }
  };

  const filteredMovements = movements.filter((movement) => {
    if (filters.type !== "all" && movement.type !== filters.type) return false;
    if (
      filters.branch !== "all" &&
      movement.fromWarehouseId !== filters.branch &&
      movement.toWarehouseId !== filters.branch
    )
      return false;

    const movementDate = new Date(movement.movementDate);
    const fromDate = new Date(filters.dateRange.from);
    const toDate = new Date(filters.dateRange.to);

    return movementDate >= fromDate && movementDate <= toDate;
  });

  const handleViewMovement = (movement: WarehouseMovement) => {
    setSelectedMovement(movement);
    setIsSheetOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movimientos de Bodega</CardTitle>
          <CardDescription>
            Historial de movimientos de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
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
          Movimientos de Bodega
        </h2>
        <p className="text-muted-foreground">
          Control y seguimiento de movimientos de inventario
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Movimiento</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  onFiltersChange({ type: value as any })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entry">Entradas</SelectItem>
                  <SelectItem value="transfer">Transferencias</SelectItem>
                  <SelectItem value="adjustment">Ajustes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sucursal</label>
              <Select
                value={filters.branch}
                onValueChange={(value) => onFiltersChange({ branch: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas las sucursales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="branch_001">Sucursal Centro</SelectItem>
                  <SelectItem value="branch_002">Sucursal Norte</SelectItem>
                  <SelectItem value="branch_003">Sucursal Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de Fechas</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-32 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(filters.dateRange.from, "dd/MM")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) =>
                        date &&
                        onFiltersChange({
                          dateRange: { ...filters.dateRange, from: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="self-center">-</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-32 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(filters.dateRange.to, "dd/MM")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) =>
                        date &&
                        onFiltersChange({
                          dateRange: { ...filters.dateRange, to: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({filteredMovements.length})
          </TabsTrigger>
          <TabsTrigger value="entry">
            Entradas (
            {filteredMovements.filter((m) => m.type === "entry").length})
          </TabsTrigger>
          <TabsTrigger value="transfer">
            Transferencias (
            {filteredMovements.filter((m) => m.type === "transfer").length})
          </TabsTrigger>
          <TabsTrigger value="adjustment">
            Ajustes (
            {filteredMovements.filter((m) => m.type === "adjustment").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Movimientos</CardTitle>
              <CardDescription>
                Historial completo de movimientos de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Realizado por</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <Badge variant={getMovementBadgeVariant(movement.type)}>
                          <div className="flex items-center gap-1">
                            {getMovementIcon(movement.type)}
                            {getMovementTypeText(movement.type)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{movement.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {movement.variantDetails}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            movement.quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {movement.quantity > 0 ? "+" : ""}
                          {movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{movement.branchName}</TableCell>
                      <TableCell>
                        {movement.movementDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{movement.performedBy}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMovement(movement)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs - simplified for brevity */}
        <TabsContent value="entry">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements
                    .filter((m) => m.type === "entry")
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.productName}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          +{movement.quantity}
                        </TableCell>
                        <TableCell>{movement.branchName}</TableCell>
                        <TableCell>
                          {movement.movementDate.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Transferencias</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Origen → Destino</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements
                    .filter((m) => m.type === "transfer")
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.productName}</TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.branchName}</TableCell>
                        <TableCell>
                          {movement.movementDate.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustment">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Ajuste</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements
                    .filter((m) => m.type === "adjustment")
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.productName}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {movement.quantity}
                        </TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>
                          {movement.movementDate.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sheet for Movement Details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Detalles del Movimiento</SheetTitle>
            <SheetDescription>
              Información completa del movimiento de inventario
            </SheetDescription>
          </SheetHeader>

          {selectedMovement && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-3">
                <Badge variant={getMovementBadgeVariant(selectedMovement.type)}>
                  {getMovementIcon(selectedMovement.type)}
                  <span className="ml-1">
                    {getMovementTypeText(selectedMovement.type)}
                  </span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedMovement.movementDate.toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Producto</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovement.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovement.variantDetails}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Cantidad</h4>
                  <p
                    className={`text-lg font-semibold ${
                      selectedMovement.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedMovement.quantity > 0 ? "+" : ""}
                    {selectedMovement.quantity} unidades
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Sucursal</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovement.branchName}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Realizado por</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovement.performedBy}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Motivo</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovement.reason}
                  </p>
                </div>

                {selectedMovement.notes && (
                  <div>
                    <h4 className="font-medium">Notas</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedMovement.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
