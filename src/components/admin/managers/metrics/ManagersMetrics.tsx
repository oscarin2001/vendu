"use client";

import { Users, UserCheck, UserX, Building } from "lucide-react";
import { ManagerMetrics } from "../shared/types";
import { MetricCard } from "../shared/components/MetricCard";

interface ManagersMetricsProps {
  metrics: ManagerMetrics;
  isLoading: boolean;
}

export function ManagersMetricsGrid({
  metrics,
  isLoading,
}: ManagersMetricsProps) {
  const metricCards = [
    {
      title: "Total Encargados",
      value: metrics.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Activos",
      value: metrics.active,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Con Sucursal",
      value: metrics.withBranch,
      icon: Building,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
