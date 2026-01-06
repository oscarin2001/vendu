"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Star, Warehouse, X } from "lucide-react";

interface Warehouse {
  id: number;
  name: string;
  address: string;
  isPrimary?: boolean;
  isAssigned?: boolean;
}

interface AssignedWarehousesProps {
  warehouses: Warehouse[];
  isAssigning: boolean;
  onRemove: (warehouseId: number) => void;
}

export function AssignedWarehouses({
  warehouses,
  isAssigning,
  onRemove,
}: AssignedWarehousesProps) {
  if (warehouses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        Bodegas Asignadas
      </h4>
      <div className="grid gap-3">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  warehouse.isPrimary ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {warehouse.isPrimary ? (
                  <Star className="h-4 w-4 text-blue-600" />
                ) : (
                  <Warehouse className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{warehouse.name}</p>
                <p className="text-sm text-gray-600">{warehouse.address}</p>
                <Badge
                  variant={warehouse.isPrimary ? "default" : "secondary"}
                  className="text-xs mt-1"
                >
                  {warehouse.isPrimary
                    ? "Bodega Principal"
                    : "Bodega Secundaria"}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(warehouse.id)}
              disabled={isAssigning}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
