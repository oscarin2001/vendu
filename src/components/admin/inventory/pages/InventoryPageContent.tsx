"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventoryMetricsCards } from "../metrics/InventoryMetricsCards";
import { GlobalStockTable } from "../tables/GlobalStockTable";
import { ProductConditionsTable } from "../tables/ProductConditionsTable";
import { ProductPerformanceTable } from "../tables/ProductPerformanceTable";
import { useInventory } from "@/services/admin/inventory/hooks/main";

export function InventoryPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const {
    inventoryData,
    metrics,
    productPerformance,
    conditions,
    isLoading,
    error,
  } = useInventory(tenantId);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventario Estratégico
          </h1>
          <p className="text-muted-foreground">
            Análisis avanzado para decisiones de compra y liquidación
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error al cargar los datos: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inventario Estratégico
        </h1>
        <p className="text-muted-foreground">
          Análisis avanzado para decisiones de compra, reposición y liquidación
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="stock">Stock Global</TabsTrigger>
          <TabsTrigger value="condition">Estado Productos</TabsTrigger>
          <TabsTrigger value="performance">Rotación</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <InventoryMetricsCards metrics={metrics} isLoading={isLoading} />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Ejecutivo</CardTitle>
                <CardDescription>
                  KPIs críticos para toma de decisiones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Productos sin movimiento (30 días)</span>
                      <span className="font-medium text-orange-600">
                        {
                          productPerformance.filter((p) => p.turnoverRate < 1)
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Productos de alta rotación</span>
                      <span className="font-medium text-green-600">
                        {
                          productPerformance.filter(
                            (p) => p.turnoverRate >= 1.5
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Valor en productos dañados</span>
                      <span className="font-medium text-red-600">
                        $
                        {conditions
                          .find((c) => c.condition === "damaged")
                          ?.totalValue.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas Estratégicas</CardTitle>
                <CardDescription>
                  Acciones recomendadas basadas en datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm font-medium text-green-800">
                      ✅ Aumentar stock de productos top
                    </div>
                    <div className="text-xs text-green-600">
                      5 productos con rotación {">"} 2x
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-sm font-medium text-orange-800">
                      ⚠️ Considerar liquidación
                    </div>
                    <div className="text-xs text-orange-600">
                      12 productos sin movimiento {">"} 30 días
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-800">
                      🚨 Revisar productos dañados
                    </div>
                    <div className="text-xs text-red-600">
                      8% del inventario requiere atención
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <GlobalStockTable metrics={metrics} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <ProductConditionsTable
            conditions={conditions}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <ProductPerformanceTable
            productPerformance={productPerformance}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
