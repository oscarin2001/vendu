"use client";

import { Building2, Users, UserCheck } from "lucide-react";
import { CompanyMetrics as CompanyMetricsType } from "@/services/admin/company";
import { MetricCard } from "./components";

interface CompanyMetricsProps {
  metrics: CompanyMetricsType;
  isLoading: boolean;
}

export function CompanyMetrics({ metrics, isLoading }: CompanyMetricsProps) {
  const metricCards = [
    {
      title: "Total Sucursales",
      value: metrics.totalBranches,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Sucursales Activas",
      value: metrics.activeBranches,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Empleados",
      value: metrics.totalEmployees,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Empleados Activos",
      value: metrics.activeEmployees,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric, index) => (
        <MetricCard
          key={index}
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
