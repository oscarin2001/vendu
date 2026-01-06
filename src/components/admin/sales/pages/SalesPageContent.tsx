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
import { SalesMetricsCards } from "../metrics/SalesMetricsCards";
import { SalesTable } from "../tables/SalesTable";
import { useSales } from "@/services/admin/sales";

export function SalesPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const { salesData, metrics, isLoading, error } = useSales(tenantId);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ventas y Finanzas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las ventas, ingresos y estado financiero de tu empresa
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
        <h1 className="text-3xl font-bold tracking-tight">Ventas y Finanzas</h1>
        <p className="text-muted-foreground">
          Gestiona las ventas, ingresos y estado financiero de tu empresa
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="sales">Ventas Generales</TabsTrigger>
          <TabsTrigger value="cashflow">Ingresos y Egresos</TabsTrigger>
          <TabsTrigger value="payments">Pagos y Estado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SalesMetricsCards metrics={metrics} isLoading={isLoading} />

          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo</CardTitle>
              <CardDescription>
                Vista general del rendimiento de ventas y finanzas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Ventas del Mes</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${metrics?.totalSales.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Órdenes Procesadas</h4>
                  <p className="text-2xl font-bold">
                    {metrics?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Generales</CardTitle>
              <CardDescription>
                Análisis detallado de ventas por día, sucursal y empleado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesTable salesData={salesData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos y Egresos</CardTitle>
              <CardDescription>
                Control del flujo de caja, gastos e ingresos reales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidad de flujo de caja próximamente
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagos y Estado Financiero</CardTitle>
              <CardDescription>
                Gestión de pagos completados, pendientes y métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidad de pagos próximamente
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
