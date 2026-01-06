"use client";

import { DashboardMetricsGrid } from "../metrics/DashboardMetrics";
import { useDashboardMetrics } from "../shared/hooks/useDashboardMetrics";

export function AdminOverview() {
  const { metrics, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de tu organización.
        </p>
      </div>

      <DashboardMetricsGrid metrics={metrics} isLoading={isLoading} />
    </div>
  );
}
