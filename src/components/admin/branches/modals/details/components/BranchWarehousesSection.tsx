"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Star } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchWarehousesSectionProps {
  branch: Branch;
}

export function BranchWarehousesSection({
  branch,
}: BranchWarehousesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warehouse className="h-5 w-5 text-blue-600" />
          Bodegas Asignadas ({branch.warehouses?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!branch.warehouses || branch.warehouses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Warehouse className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay bodegas asignadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {branch.warehouses?.map((warehouse) => (
              <div
                key={warehouse.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Warehouse className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{warehouse.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {warehouse.address}
                    </p>
                  </div>
                </div>
                {warehouse.isPrimary && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
