"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import type { SalesMetrics } from "@/services/admin/sales";

interface SalesMetricsProps {
  metrics: SalesMetrics | null;
  isLoading: boolean;
}

export function SalesMetricsCards({ metrics, isLoading }: SalesMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "Total Ventas",
      value: `$${metrics.totalSales.toLocaleString()}`,
      icon: DollarSign,
      description: "Ingresos totales",
    },
    {
      title: "Total Órdenes",
      value: metrics.totalOrders.toString(),
      icon: ShoppingCart,
      description: "Órdenes completadas",
    },
    {
      title: "Valor Promedio",
      value: `$${metrics.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      description: "Por orden",
    },
    {
      title: "Clientes Activos",
      value: "0", // TODO: Implement customer count
      icon: Users,
      description: "Este mes",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}