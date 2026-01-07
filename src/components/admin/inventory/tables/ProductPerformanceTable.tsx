"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react";
import type { ProductPerformance } from "@/services/admin/inventory/types";

interface ProductPerformanceTableProps {
  productPerformance: ProductPerformance[];
  isLoading: boolean;
}

export function ProductPerformanceTable({
  productPerformance,
  isLoading,
}: ProductPerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const getPerformanceBadge = (turnoverRate: number) => {
    if (turnoverRate >= 2) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Alta Rotación
        </Badge>
      );
    } else if (turnoverRate >= 1) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Buena Rotación
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          Baja Rotación
        </Badge>
      );
    }
  };

  const topPerformers = productPerformance
    .filter((p) => p.turnoverRate >= 1.5)
    .sort((a, b) => b.totalSold - a.totalSold);

  const slowMovers = productPerformance
    .filter((p) => p.turnoverRate < 1)
    .sort(
      (a, b) =>
        a.lastSoldDate?.getTime() || 0 - (b.lastSoldDate?.getTime() || 0)
    );

  const daysSinceLastSale = (lastSoldDate: Date | null | undefined) => {
    if (!lastSoldDate) return "Nunca vendido";
    const days = Math.floor(
      (new Date().getTime() - lastSoldDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} días`;
  };

  const slowMoversCount = slowMovers.length;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Productos Más y Menos Vendidos - Análisis de Rotación
          </h2>
          <p className="text-muted-foreground">
            Identifica qué rota rápido y qué se queda muerto para decisiones de
            compra
          </p>
        </div>

        {/* Alert para productos muertos */}
        {slowMoversCount > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Hay <strong>{slowMoversCount} productos</strong> que no han tenido
              movimiento significativo en los últimos 30 días. Se recomienda
              considerar rebajas o liquidación.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="top" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="top" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Ventas (Hits)
            </TabsTrigger>
            <TabsTrigger value="slow" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Stock Muerto (Lentos)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos de Alta Rotación</CardTitle>
                <CardDescription>
                  Los más vendidos - indica demanda fuerte, considerar aumentar
                  stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Vendidos</TableHead>
                        <TableHead className="text-right">Ingresos</TableHead>
                        <TableHead className="text-right">
                          Precio Promedio
                        </TableHead>
                        <TableHead>Rotación</TableHead>
                        <TableHead>Última Venta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPerformers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No hay productos de alta rotación
                          </TableCell>
                        </TableRow>
                      ) : (
                        topPerformers.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={product.imageUrl}
                                    alt={product.productName}
                                  />
                                  <AvatarFallback>
                                    {product.productName
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {product.productName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    SKU: {product.sku}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {product.totalSold}
                            </TableCell>
                            <TableCell className="text-right">
                              ${product.totalRevenue.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ${product.averagePrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {getPerformanceBadge(product.turnoverRate)}
                            </TableCell>
                            <TableCell>
                              {product.lastSoldDate
                                ? product.lastSoldDate.toLocaleDateString()
                                : "Nunca"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos de Baja Rotación</CardTitle>
                <CardDescription>
                  Los que se quedan muertos - considerar liquidación o
                  descatalogación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">
                          Valor Stock
                        </TableHead>
                        <TableHead>Rotación</TableHead>
                        <TableHead>Última Venta</TableHead>
                        <TableHead>Días Sin Movimiento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowMovers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No hay productos de baja rotación
                          </TableCell>
                        </TableRow>
                      ) : (
                        slowMovers.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={product.imageUrl}
                                    alt={product.productName}
                                  />
                                  <AvatarFallback>
                                    {product.productName
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {product.productName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    SKU: {product.sku}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {product.stockLevel}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {(
                                product.stockLevel * product.averagePrice
                              ).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getPerformanceBadge(product.turnoverRate)}
                            </TableCell>
                            <TableCell>
                              {product.lastSoldDate
                                ? product.lastSoldDate.toLocaleDateString()
                                : "Nunca"}
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    <span className="text-orange-600 font-medium">
                                      {daysSinceLastSale(product.lastSoldDate)}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Producto sin movimiento desde hace tiempo.
                                  </p>
                                  <p>Considerar rebaja o liquidación.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
