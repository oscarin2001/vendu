"use client";

import { Warehouse, UserCheck, UserX, Package, TrendingUp } from "lucide-react";
import { WarehouseMetrics } from "@/services/admin/warehouses-logistics/types";
import { MetricCard } from "../../customers/shared";

interface WarehousesLogisticsMetricsGridProps {
  metrics: WarehouseMetrics | null;
  isLoading: boolean;
}

export function WarehousesLogisticsMetricsGrid({
  metrics,
  isLoading,
}: WarehousesLogisticsMetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Bodegas"
        value={metrics.totalWarehouses.toString()}
        description="Bodegas registradas"
        icon={Warehouse}
        trend={{ value: 5, isPositive: true }}
      />

      <MetricCard
        title="Ocupación Promedio"
        value={`${metrics.averageOccupancy.toFixed(1)}%`}
        description="Promedio de ocupación"
        icon={TrendingUp}
        trend={{ value: 3, isPositive: true }}
      />

      <MetricCard
        title="Capacidad Total"
        value={`${metrics.totalCapacity.toLocaleString()} m³`}
        description="Espacio disponible"
        icon={Package}
      />

      <MetricCard
        title="Capacidad Utilizada"
        value={`${metrics.usedCapacity.toLocaleString()} m³`}
        description="Espacio ocupado"
        icon={Package}
      />

      <MetricCard
        title="Ocupación Promedio"
        value={`${metrics.averageOccupancy}%`}
        description="Promedio de todas las bodegas"
        icon={TrendingUp}
        trend={{ value: 3, isPositive: true }}
      />
    </div>
  );
}
