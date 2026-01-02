"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Building, UserX } from "lucide-react";
import { ManagerMetrics } from "@/services/admin/managers/types/manager.types";

interface ManagersMetricsProps {
  metrics: ManagerMetrics;
  isLoading: boolean;
}

export function ManagersMetrics({ metrics, isLoading }: ManagersMetricsProps) {
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
      title: "Desactivados",
      value: metrics.deactivated,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Inactivos",
      value: metrics.inactive,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
