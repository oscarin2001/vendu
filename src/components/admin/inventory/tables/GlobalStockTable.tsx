"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import { Eye, Package, Warehouse } from "lucide-react";
import type { InventoryMetrics } from "@/services/admin/inventory/types";

interface GlobalStockTableProps {
  metrics: InventoryMetrics | null;
  isLoading: boolean;
}

export function GlobalStockTable({
  metrics,
  isLoading,
}: GlobalStockTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No se pudieron cargar las métricas de inventario
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Stock Global - Visión Estratégica
        </h2>
        <p className="text-muted-foreground">
          Análisis completo del inventario para decisiones de compra y
          liquidación
        </p>
      </div>

      {/* Totales Generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prendas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unidades en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Valor de inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sucursales Activas
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeBranches}</div>
            <p className="text-xs text-muted-foreground">
              Con stock disponible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bodegas Utilizadas
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeWarehouses}</div>
            <p className="text-xs text-muted-foreground">Total de bodegas</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Stock por Sucursal con Popover */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Stock por Sucursal
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalle
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Distribución por Sucursal</h4>
                  <div className="space-y-3">
                    {metrics.stockByBranch.map((branch) => (
                      <div key={branch.branchId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{branch.branchName}</span>
                          <span className="font-medium">
                            {branch.totalItems} prendas
                          </span>
                        </div>
                        <Progress
                          value={(branch.totalItems / metrics.totalItems) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {(
                            (branch.totalItems / metrics.totalItems) *
                            100
                          ).toFixed(1)}
                          % del total
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <CardDescription>
            Distribución del inventario por ubicación física
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.stockByBranch.slice(0, 5).map((branch) => (
              <div key={branch.branchId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{branch.branchName}</span>
                  <Badge variant="secondary">{branch.totalItems} prendas</Badge>
                </div>
                <Progress
                  value={(branch.totalItems / metrics.totalItems) * 100}
                  className="h-3"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock por Bodega */}
      <Card>
        <CardHeader>
          <CardTitle>Stock por Bodega</CardTitle>
          <CardDescription>
            Capacidad y ocupación de cada bodega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.stockByWarehouse.map((warehouse) => (
              <div key={warehouse.warehouseId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{warehouse.warehouseName}</span>
                  <div className="text-right text-sm">
                    <div>{warehouse.totalItems} prendas</div>
                    <div className="text-muted-foreground">
                      {warehouse.occupancyRate.toFixed(1)}% ocupado
                    </div>
                  </div>
                </div>
                <Progress value={warehouse.occupancyRate} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{warehouse.location}</span>
                  <span>Cap: {warehouse.capacity} m³</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
