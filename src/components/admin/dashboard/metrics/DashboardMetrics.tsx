"use client";

import {
  Users,
  Building2,
  DollarSign,
  Package,
  UserCheck,
  Shield,
  Truck,
  Warehouse,
} from "lucide-react";
import type { DashboardMetrics as DashboardMetricsType } from "../shared/types";
import { MetricCard } from "../shared/components/MetricCard";

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
  isLoading: boolean;
}

export function DashboardMetricsGrid({
  metrics,
  isLoading,
}: DashboardMetricsProps) {
  const metricCards = [
    {
      title: "Total Usuarios",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Sucursales",
      value: metrics.totalBranches,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ventas Totales",
      value: metrics.totalSales,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      format: "currency",
    },
    {
      title: "Inventario",
      value: metrics.totalInventory,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Usuarios Activos",
      value: metrics.activeUsers,
      icon: UserCheck,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Gerentes",
      value: metrics.totalManagers,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Proveedores",
      value: metrics.totalSuppliers,
      icon: Truck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Almacenes",
      value: metrics.totalWarehouses,
      icon: Warehouse,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
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
