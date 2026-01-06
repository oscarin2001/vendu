"use client";

import { Warehouse, UserCheck, UserX, Users } from "lucide-react";
import { WarehouseMetrics } from "../shared/types";
import { MetricCard } from "../shared/components/MetricCard";

interface WarehousesMetricsGridProps {
  metrics: WarehouseMetrics;
  isLoading: boolean;
}

export function WarehousesMetricsGrid({
  metrics,
  isLoading,
}: WarehousesMetricsGridProps) {
  const metricCards = [
    {
      title: "Total Bodegas",
      value: metrics.total,
      icon: Warehouse,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Con Gerente",
      value: metrics.withManager,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Sin Gerente",
      value: metrics.withoutManager,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Gerentes sin Asignar",
      value: metrics.unassignedManagers,
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          bgColor={metric.bgColor}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
