"use client";

import { Building2, UserCheck, UserX } from "lucide-react";
import { BranchMetrics } from "@/services/admin/branches";
import { MetricCard } from "../shared/components/MetricCard";

interface BranchesMetricsProps {
  metrics: BranchMetrics;
  isLoading: boolean;
}

export function BranchesMetrics({ metrics, isLoading }: BranchesMetricsProps) {
  const metricCards = [
    {
      title: "Total Sucursales",
      value: metrics.total,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
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
