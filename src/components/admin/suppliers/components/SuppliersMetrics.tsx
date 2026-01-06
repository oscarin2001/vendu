"use client";

import { Truck, CheckCircle, UserCheck, UserX } from "lucide-react";
import { SupplierMetrics } from "../shared/types";
import { MetricCard } from "../shared/components/MetricCard";

interface SuppliersMetricsProps {
  metrics: SupplierMetrics;
  isLoading: boolean;
}

export function SuppliersMetricsGrid({
  metrics,
  isLoading,
}: SuppliersMetricsProps) {
  const metricCards = [
    {
      title: "Total Proveedores",
      value: metrics.total,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Activos",
      value: metrics.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Con Encargado",
      value: metrics.withManagers,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Sin Encargado",
      value: metrics.withoutManagers,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
