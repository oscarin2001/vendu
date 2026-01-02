"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, UserCheck, UserX } from "lucide-react";
import { WarehouseMetrics } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehousesMetricsProps {
  metrics: WarehouseMetrics;
  isLoading: boolean;
}

export function WarehousesMetrics({
  metrics,
  isLoading,
}: WarehousesMetricsProps) {
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
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {metricCards.map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricCards.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
