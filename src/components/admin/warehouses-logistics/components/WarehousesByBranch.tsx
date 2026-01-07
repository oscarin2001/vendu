"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Warehouse as WarehouseIcon, User, MapPin } from "lucide-react";
import type { Warehouse } from "@/services/admin/warehouses-logistics/types";

interface WarehousesByBranchProps {
  warehouses: Warehouse[];
  isLoading: boolean;
}

export function WarehousesByBranch({
  warehouses,
  isLoading,
}: WarehousesByBranchProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted" />
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "bg-red-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getOccupancyText = (rate: number) => {
    if (rate >= 80) return "Crítico";
    if (rate >= 60) return "Alto";
    return "Normal";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Bodegas por Sucursal
        </h2>
        <p className="text-muted-foreground">
          Estado actual de capacidad y ocupación de inventario
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {warehouse.branchName}
                  </CardTitle>
                </div>
                <Badge variant="outline">{warehouse.type}</Badge>
              </div>
              <CardDescription>{warehouse.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Capacity Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Ocupación</span>
                  <span>{warehouse.currentOccupancy}%</span>
                </div>
                <Progress value={warehouse.currentOccupancy} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {warehouse.usedCapacity} / {warehouse.totalCapacity} m³
                </div>
              </div>

              {/* Manager Info */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {warehouse.managerName}
                      </p>
                      <p className="text-xs text-muted-foreground">Encargado</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      {warehouse.managerName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Encargado de bodega en {warehouse.branchName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p className="text-muted-foreground">
                          {warehouse.managerEmail}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span>
                        <p className="text-muted-foreground">
                          {warehouse.managerPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {warehouse.totalProducts}
                  </div>
                  <div className="text-xs text-muted-foreground">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {warehouse.activeMovements}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Movimientos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
