"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { ProductCondition } from "@/services/admin/inventory/types";

const COLORS = {
  excellent: "#10b981",
  good: "#3b82f6",
  acceptable: "#f59e0b",
  damaged: "#ef4444",
};
const LABELS = {
  excellent: "Excelente",
  good: "Bueno",
  acceptable: "Aceptable",
  damaged: "Dañado",
};

export function ProductConditionsTable({
  conditions,
  isLoading,
}: {
  conditions: ProductCondition[];
  isLoading: boolean;
}) {
  if (isLoading || !conditions.length)
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );

  const data = conditions.map((c) => ({
    name: LABELS[c.condition as keyof typeof LABELS],
    value: c.totalItems,
    color: COLORS[c.condition as keyof typeof COLORS],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            {conditions.map((c) => (
              <div
                key={c.condition}
                className="flex justify-between items-center"
              >
                <Badge
                  style={{
                    backgroundColor: COLORS[c.condition as keyof typeof COLORS],
                  }}
                  className="text-white"
                >
                  {LABELS[c.condition as keyof typeof LABELS]}
                </Badge>
                <div className="text-right">
                  <div className="font-medium">{c.totalItems}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  dataKey="value"
                >
                  {data.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={data[i].color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
