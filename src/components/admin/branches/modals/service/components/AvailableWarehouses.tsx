"use client";

import { Button } from "@/components/ui/Button";
import { AlertCircle, Plus, Star, Warehouse } from "lucide-react";

interface Warehouse {
  id: number;
  name: string;
  address: string;
  isPrimary?: boolean;
  isAssigned?: boolean;
}

interface AvailableWarehousesProps {
  warehouses: Warehouse[];
  isAssigning: boolean;
  onAssign: (warehouseId: number, isPrimary: boolean) => void;
}

export function AvailableWarehouses({
  warehouses,
  isAssigning,
  onAssign,
}: AvailableWarehousesProps) {
  if (warehouses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        Bodegas Disponibles
      </h4>
      <div className="grid gap-3">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{warehouse.name}</p>
                <p className="text-sm text-gray-600">{warehouse.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssign(warehouse.id, false)}
                disabled={isAssigning}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Secundaria
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAssign(warehouse.id, true)}
                disabled={isAssigning}
              >
                <Star className="h-4 w-4 mr-1" />
                Designar Principal
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
