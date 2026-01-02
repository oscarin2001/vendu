"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Warehouse, UserCheck, UserX } from "lucide-react";
import { BranchMetrics } from "@/services/admin/branches/types/branch.types";

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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricCards.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
