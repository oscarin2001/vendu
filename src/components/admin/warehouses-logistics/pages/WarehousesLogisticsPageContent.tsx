"use client";

import { useParams } from "next/navigation";
import { WarehousesLogisticsMetricsGrid } from "../metrics/WarehousesLogisticsMetricsGrid";
import { WarehousesByBranch } from "../components/WarehousesByBranch";
import { WarehouseMovementsTable } from "../tables/WarehouseMovementsTable";
import { useWarehouseLogistics } from "@/services/admin/warehouses-logistics/hooks/main";

export function WarehousesLogisticsPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const {
    metrics,
    warehouses,
    movements,
    filters,
    isLoading,
    updateFilters,
    clearFilters,
  } = useWarehouseLogistics(tenantId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bodegas y Logística
        </h1>
        <p className="text-muted-foreground">
          Control y supervisión de bodegas, inventario y movimientos logísticos
        </p>
      </div>

      {/* Metrics */}
      <WarehousesLogisticsMetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* Warehouses by Branch */}
      <WarehousesByBranch warehouses={warehouses} isLoading={isLoading} />

      {/* Warehouse Movements */}
      <WarehouseMovementsTable
        movements={movements}
        filters={filters}
        isLoading={isLoading}
        onFiltersChange={updateFilters}
      />
    </div>
  );
}
