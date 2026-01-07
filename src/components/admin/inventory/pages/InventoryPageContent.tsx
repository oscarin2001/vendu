"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryMetricsCards } from "../metrics/InventoryMetricsCards";
import { InventoryTable } from "../tables/InventoryTable";
import { ProductPerformanceTable } from "../tables/ProductPerformanceTable";
import { useInventory } from "@/services/admin/inventory/hooks/main";

export function InventoryPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const { inventoryData, metrics, productPerformance, isLoading, error } = useInventory(tenantId);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona el stock, estado de productos y rendimiento de tu inventario
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
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">
          Gestiona el stock, estado de productos y rendimiento de tu inventario
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="stock">Stock Global</TabsTrigger>
          <TabsTrigger value="condition">Estado Productos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <InventoryMetricsCards metrics={metrics} isLoading={isLoading} />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Sucursal</CardTitle>
                <CardDescription>
                  Stock distribuido en diferentes sucursales
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics?.stockByBranch.length === 0 ? (
                  <p className="text-muted-foreground">No hay datos disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {metrics?.stockByBranch.slice(0, 5).map((branch: { branchName: string; itemCount: number; value: number }) => (
                      <div key={branch.branchName} className="flex justify-between">
                        <span>{branch.branchName}</span>
                        <span className="font-medium">{branch.itemCount} items</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Productos</CardTitle>
                <CardDescription>
                  Calidad del inventario por condición
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Excelente</span>
                      <span className="font-medium">{metrics.stockByCondition.excellent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bueno</span>
                      <span className="font-medium">{metrics.stockByCondition.good}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aceptable</span>
                      <span className="font-medium">{metrics.stockByCondition.acceptable}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dañado</span>
                      <span className="font-medium">{metrics.stockByCondition.damaged}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Global</CardTitle>
              <CardDescription>
                Total de prendas, stock por sucursal y bodega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryTable inventoryData={inventoryData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Productos</CardTitle>
              <CardDescription>
                Control de calidad: Excelente, Bueno, Aceptable, Dañado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidad de estado de productos próximamente
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Más y Menos Vendidos</CardTitle>
              <CardDescription>
                Análisis de qué rota rápido y qué se queda muerto en inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductPerformanceTable
                productPerformance={productPerformance}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}