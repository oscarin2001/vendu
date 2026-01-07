"use client";

import { Users, UserCheck, UserPlus, Crown, DollarSign, TrendingUp, Target } from "lucide-react";
import { CustomerMetrics } from "@/services/admin/customers/types";
import { MetricCard } from "../shared";

interface CustomersMetricsGridProps {
  metrics: CustomerMetrics | null;
  isLoading: boolean;
}

export function CustomersMetricsGrid({ metrics, isLoading }: CustomersMetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Clientes"
        value={metrics.totalCustomers.toLocaleString()}
        description="Clientes registrados"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />

      <MetricCard
        title="Clientes Activos"
        value={metrics.activeCustomers.toLocaleString()}
        description="Compraron en los últimos 30 días"
        icon={UserCheck}
        trend={{ value: 8, isPositive: true }}
      />

      <MetricCard
        title="Nuevos Este Mes"
        value={metrics.newCustomersThisMonth}
        description="Clientes nuevos"
        icon={UserPlus}
        trend={{ value: 15, isPositive: true }}
      />

      <MetricCard
        title="Clientes Leales"
        value={metrics.loyalCustomers}
        description="Más de 20 compras"
        icon={Crown}
        trend={{ value: 5, isPositive: true }}
      />

      <MetricCard
        title="Valor Promedio Orden"
        value={`$${metrics.averageOrderValue.toFixed(2)}`}
        description="Por transacción"
        icon={DollarSign}
        trend={{ value: 3, isPositive: true }}
      />

      <MetricCard
        title="Tasa Retención"
        value={`${metrics.customerRetentionRate}%`}
        description="Clientes recurrentes"
        icon={TrendingUp}
        trend={{ value: 2, isPositive: true }}
      />

      <MetricCard
        title="Valor Vida Cliente"
        value={`$${metrics.customerLifetimeValue.toFixed(2)}`}
        description="Valor promedio total"
        icon={Target}
        trend={{ value: 7, isPositive: true }}
      />

      <MetricCard
        title="Segmentos Top"
        value={metrics.topCustomerSegments[0]?.segment || 'N/A'}
        description={`${metrics.topCustomerSegments[0]?.count || 0} clientes`}
        icon={Target}
      />
    </div>
  );
}