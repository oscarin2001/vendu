"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import type { ProductCondition } from "@/services/admin/inventory/types";

interface ProductConditionsTableProps {
  conditions: ProductCondition[];
  isLoading: boolean;
}

const CONDITION_COLORS = {
  excellent: "#10b981", // Verde esmeralda
  good: "#3b82f6", // Azul
  acceptable: "#f59e0b", // Amarillo/Naranja
  damaged: "#ef4444", // Rojo
};

const CONDITION_LABELS = {
  excellent: "Excelente",
  good: "Bueno",
  acceptable: "Aceptable",
  damaged: "Dañado",
};

export function ProductConditionsTable({
  conditions,
  isLoading,
}: ProductConditionsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Función helper para acceso seguro a las constantes
  const getConditionLabel = (condition: string) =>
    CONDITION_LABELS[condition as keyof typeof CONDITION_LABELS];
  const getConditionColor = (condition: string) =>
    CONDITION_COLORS[condition as keyof typeof CONDITION_COLORS];

  // Preparar datos para el gráfico de pastel
  const chartData = conditions.map((condition) => ({
    name: getConditionLabel(condition.condition),
    value: condition.totalItems,
    percentage: condition.percentage,
    color: getConditionColor(condition.condition),
  }));

  const totalItems = conditions.reduce((sum, c) => sum + c.totalItems, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Estado de Productos - Segunda Mano
        </h2>
        <p className="text-muted-foreground">
          Análisis crítico del estado de la mercancía para decisiones de
          liquidación
        </p>
      </div>

      {/* Gráfico de Pastel */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <CardDescription>
              Porcentaje de productos por condición de calidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(
                    value: number | undefined,
                    name: string | undefined
                  ) => [
                    value
                      ? `${value} prendas (${(
                          (value / totalItems) *
                          100
                        ).toFixed(1)}%)`
                      : "0 prendas",
                    name || "Sin nombre",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas por Estado</CardTitle>
            <CardDescription>
              Resumen detallado de cada condición
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div
                  key={condition.condition}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: getConditionColor(condition.condition),
                      }}
                      className="text-white"
                    >
                      {getConditionLabel(condition.condition)}
                    </Badge>
                    <div>
                      <div className="font-medium">
                        {condition.totalItems} prendas
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {condition.percentage.toFixed(1)}% del total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Valor estimado</div>
                    <div className="text-xs text-muted-foreground">
                      Basado en condición
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Ajustes de Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Historial de Ajustes de Estado
          </CardTitle>
          <CardDescription>
            Cambios de condición de productos (ej: Excelente → Dañado)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cambio de Estado</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock data - replace with real data */}
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Vestido Negro Talla M</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: VST-NEG-M
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: CONDITION_COLORS.excellent }}
                      className="text-white"
                    >
                      Excelente
                    </Badge>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: CONDITION_COLORS.damaged }}
                      className="text-white"
                    >
                      Dañado
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>1 unidad</TableCell>
                <TableCell>Manchas de tinta</TableCell>
                <TableCell>2024-01-05</TableCell>
                <TableCell>María González</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Blusa Blanca Talla S</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: BLU-BLA-S
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: CONDITION_COLORS.good }}
                      className="text-white"
                    >
                      Bueno
                    </Badge>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: CONDITION_COLORS.excellent }}
                      className="text-white"
                    >
                      Excelente
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>2 unidades</TableCell>
                <TableCell>Revisión de calidad</TableCell>
                <TableCell>2024-01-04</TableCell>
                <TableCell>Carlos Rodríguez</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
