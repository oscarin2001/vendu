"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WarehousesByBranch } from "@/components/admin/warehouses-logistics/components/WarehousesByBranch";
import { WarehouseMovementsTable } from "@/components/admin/warehouses-logistics/tables/WarehouseMovementsTable";
import { WarehouseMetrics } from "@/components/admin/warehouses-logistics/components/WarehouseMetrics";
import { useWarehouseLogistics } from "@/services/admin/warehouses-logistics";
import { WarehouseFilters } from "@/services/admin/warehouses-logistics/types";
import { Warehouse, Truck, BarChart3 } from "lucide-react";

export default function WarehousesLogisticsPage() {
  const { warehouses, movements, metrics, isLoading } =
    useWarehouseLogistics("tenant_123");

  const [filters, setFilters] = useState<WarehouseFilters>({
    type: "all",
    branch: "all",
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
  });

  const handleFiltersChange = (newFilters: Partial<WarehouseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Logística y Bodegas
        </h1>
        <p className="text-muted-foreground">
          Gestión integral de inventario, movimientos y distribución
        </p>
      </div>

      {/* Metrics Overview */}
      <WarehouseMetrics metrics={metrics} isLoading={isLoading} />

      <Tabs defaultValue="warehouses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="warehouses" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Bodegas por Sucursal
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Movimientos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="space-y-6">
          <WarehousesByBranch warehouses={warehouses} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <WarehouseMovementsTable
            movements={movements}
            filters={filters}
            isLoading={isLoading}
            onFiltersChange={handleFiltersChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
