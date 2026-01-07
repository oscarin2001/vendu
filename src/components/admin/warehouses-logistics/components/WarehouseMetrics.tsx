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
import type { WarehouseMetrics } from "@/services/admin/warehouses-logistics/types";
import {
  Warehouse,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface WarehouseMetricsProps {
  metrics: WarehouseMetrics | null;
  isLoading: boolean;
}

export function WarehouseMetrics({
  metrics,
  isLoading,
}: WarehouseMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No se pudieron cargar las métricas
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Métricas de Bodegas
        </h2>
        <p className="text-muted-foreground">
          Resumen ejecutivo del estado de inventario y logística
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Warehouses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bodegas</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">Sucursales activas</p>
          </CardContent>
        </Card>

        {/* Assigned Warehouses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bodegas Asignadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.assignedWarehouses}
            </div>
            <p className="text-xs text-muted-foreground">
              Con gerente asignado
            </p>
          </CardContent>
        </Card>

        {/* Unassigned Warehouses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bodegas Sin Asignar
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.unassignedWarehouses}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren asignación
            </p>
          </CardContent>
        </Card>

        {/* Total Capacity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacidad Total
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.totalCapacity / 1000).toFixed(0)}k m³
            </div>
            <p className="text-xs text-muted-foreground">Espacio disponible</p>
          </CardContent>
        </Card>

        {/* Used Capacity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacidad Utilizada
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.usedCapacity / 1000).toFixed(0)}k m³
            </div>
            <p className="text-xs text-muted-foreground">Espacio ocupado</p>
          </CardContent>
        </Card>

        {/* Average Occupancy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ocupación Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageOccupancy.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Utilización actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Capacidad</CardTitle>
          <CardDescription>
            Distribución de espacio utilizado vs disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Capacidad Utilizada</span>
              <span>
                {(metrics.usedCapacity / 1000).toFixed(0)}k /{" "}
                {(metrics.totalCapacity / 1000).toFixed(0)}k m³
              </span>
            </div>
            <Progress
              value={(metrics.usedCapacity / metrics.totalCapacity) * 100}
              className="h-3"
            />
            <div className="text-xs text-muted-foreground text-center">
              {((metrics.usedCapacity / metrics.totalCapacity) * 100).toFixed(
                1
              )}
              % de ocupación total
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
