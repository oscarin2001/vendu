"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, TrendingUp, AlertTriangle } from "lucide-react";
import type { InventoryMetrics } from "@/services/admin/inventory";

interface InventoryMetricsCardsProps {
  metrics: InventoryMetrics | null;
  isLoading: boolean;
}

export function InventoryMetricsCards({ metrics, isLoading }: InventoryMetricsCardsProps) {
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
      title: "Total de Prendas",
      value: metrics.totalItems.toLocaleString(),
      icon: Package,
      description: "En inventario",
    },
    {
      title: "Valor Total",
      value: `$${metrics.totalValue.toLocaleString()}`,
      icon: TrendingUp,
      description: "Valor del stock",
    },
    {
      title: "Sucursales",
      value: metrics.stockByBranch.length.toString(),
      icon: Warehouse,
      description: "Con inventario",
    },
    {
      title: "Estado Excelente",
      value: `${metrics.stockByCondition.excellent}%`,
      icon: AlertTriangle,
      description: "Calidad premium",
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