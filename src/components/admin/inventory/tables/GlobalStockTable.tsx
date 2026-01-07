"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InventoryMetrics } from "@/services/admin/inventory/types";

export function GlobalStockTable({
  metrics,
  isLoading,
}: {
  metrics: InventoryMetrics | null;
  isLoading: boolean;
}) {
  if (isLoading || !metrics)
    return <div className="h-32 bg-muted animate-pulse rounded" />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stock Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Prendas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Estimado</p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Stock por Sucursal</h3>
        {metrics.stockByBranch.slice(0, 3).map((b) => (
          <div key={b.branchId} className="flex justify-between text-sm">
            <span>{b.branchName}</span>
            <span className="font-medium">{b.totalItems}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
