"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { ProductPerformance } from "@/services/admin/inventory/types";

export function ProductPerformanceTable({
  productPerformance,
  isLoading,
}: {
  productPerformance: ProductPerformance[];
  isLoading: boolean;
}) {
  if (isLoading || !productPerformance.length)
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="top">Top</TabsTrigger>
            <TabsTrigger value="slow">Lentos</TabsTrigger>
          </TabsList>
          <TabsContent value="top">
            <div className="space-y-2">
              {productPerformance
                .filter((p) => p.turnoverRate >= 1.5)
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p.productId}
                    className="flex justify-between p-2 border rounded"
                  >
                    <span className="font-medium">{p.productName}</span>
                    <Badge variant="secondary">
                      {p.turnoverRate.toFixed(1)}x
                    </Badge>
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="slow">
            <div className="space-y-2">
              {productPerformance
                .filter((p) => p.turnoverRate < 1)
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p.productId}
                    className="flex justify-between p-2 border rounded"
                  >
                    <span className="font-medium">{p.productName}</span>
                    <Badge variant="destructive">
                      {p.turnoverRate.toFixed(1)}x
                    </Badge>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
