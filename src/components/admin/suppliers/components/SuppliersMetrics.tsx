"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle, UserCheck, UserX } from "lucide-react";
import { SupplierMetrics } from "@/services/admin/suppliers/types/supplier.types";

interface SuppliersMetricsProps {
  metrics: SupplierMetrics;
  isLoading: boolean;
}

export function SuppliersMetrics({
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
      value: metrics.withManager,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Sin Encargado",
      value: metrics.withoutManager,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
              <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
