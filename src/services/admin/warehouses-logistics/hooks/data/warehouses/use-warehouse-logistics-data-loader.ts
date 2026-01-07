"use client";

import { useEffect, useState } from "react";
import type {
  WarehouseMetrics,
  WarehouseMovement,
  WarehouseFilters,
  Warehouse,
} from "../../../types";

export function useWarehouseLogisticsDataLoader(tenantId: string) {
  const [metrics, setMetrics] = useState<WarehouseMetrics | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [movements, setMovements] = useState<WarehouseMovement[]>([]);
  const [filters, setFilters] = useState<WarehouseFilters>({
    type: "all",
    branch: "all",
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock metrics
        const mockMetrics: WarehouseMetrics = {
          totalWarehouses: 12,
          assignedWarehouses: 8,
          unassignedWarehouses: 4,
          totalCapacity: 50000,
          usedCapacity: 32500,
          averageOccupancy: 65,
          warehousesByBranch: [
            {
              branchId: "branch_001",
              branchName: "Sucursal Centro",
              warehouseCount: 2,
              totalCapacity: 8000,
              usedCapacity: 6500,
              occupancyRate: 81.25,
              manager: {
                id: "mgr_001",
                name: "Carlos Rodríguez",
                email: "carlos@empresa.com",
                phone: "+56912345678",
              },
            },
            {
              branchId: "branch_002",
              branchName: "Sucursal Norte",
              warehouseCount: 1,
              totalCapacity: 5000,
              usedCapacity: 2800,
              occupancyRate: 56,
              manager: {
                id: "mgr_002",
                name: "María González",
                email: "maria@empresa.com",
                phone: "+56987654321",
              },
            },
            {
              branchId: "branch_003",
              branchName: "Sucursal Sur",
              warehouseCount: 1,
              totalCapacity: 6000,
              usedCapacity: 4200,
              occupancyRate: 70,
            },
          ],
        };

        // Mock warehouses
        const mockWarehouses: Warehouse[] = [
          {
            id: "wh_001",
            branchName: "Sucursal Centro",
            location: "Av. Providencia 123, Santiago",
            type: "Principal",
            totalCapacity: 8000,
            usedCapacity: 6500,
            currentOccupancy: 81,
            totalProducts: 2450,
            activeMovements: 12,
            managerName: "Carlos Rodríguez",
            managerEmail: "carlos@empresa.com",
            managerPhone: "+56912345678",
          },
          {
            id: "wh_002",
            branchName: "Sucursal Centro",
            location: "Av. Providencia 123, Santiago",
            type: "Secundaria",
            totalCapacity: 3000,
            usedCapacity: 1800,
            currentOccupancy: 60,
            totalProducts: 890,
            activeMovements: 5,
            managerName: "Carlos Rodríguez",
            managerEmail: "carlos@empresa.com",
            managerPhone: "+56912345678",
          },
          {
            id: "wh_003",
            branchName: "Sucursal Norte",
            location: "Av. Las Condes 456, Santiago",
            type: "Principal",
            totalCapacity: 5000,
            usedCapacity: 2800,
            currentOccupancy: 56,
            totalProducts: 1200,
            activeMovements: 8,
            managerName: "María González",
            managerEmail: "maria@empresa.com",
            managerPhone: "+56987654321",
          },
          {
            id: "wh_004",
            branchName: "Sucursal Sur",
            location: "Av. Kennedy 789, Santiago",
            type: "Principal",
            totalCapacity: 6000,
            usedCapacity: 4200,
            currentOccupancy: 70,
            totalProducts: 1650,
            activeMovements: 6,
            managerName: "Ana López",
            managerEmail: "ana@empresa.com",
            managerPhone: "+56911223344",
          },
        ];

        // Mock movements
        const mockMovements: WarehouseMovement[] = [
          {
            id: "mov_001",
            type: "entry",
            productId: "prod_001",
            productName: "iPhone 15 Pro",
            variantId: "var_001",
            variantDetails: "128GB - Negro",
            quantity: 50,
            toWarehouseId: "wh_001",
            branchId: "branch_001",
            branchName: "Sucursal Centro",
            movementDate: new Date("2024-01-06"),
            reason: "Compra proveedor",
            performedBy: "Carlos Rodríguez",
            notes: "Entrega programada",
          },
          {
            id: "mov_002",
            type: "transfer",
            productId: "prod_002",
            productName: "MacBook Air",
            variantId: "var_002",
            variantDetails: "M2 - 256GB",
            quantity: 10,
            fromWarehouseId: "wh_001",
            toWarehouseId: "wh_002",
            branchId: "branch_001",
            branchName: "Sucursal Centro",
            movementDate: new Date("2024-01-07"),
            reason: "Reubicación de inventario",
            performedBy: "María González",
          },
          {
            id: "mov_003",
            type: "adjustment",
            productId: "prod_003",
            productName: "AirPods Pro",
            variantId: "var_003",
            variantDetails: "2nd Gen",
            quantity: -5,
            fromWarehouseId: "wh_001",
            branchId: "branch_001",
            branchName: "Sucursal Centro",
            movementDate: new Date("2024-01-08"),
            reason: "Venta",
            performedBy: "Carlos Rodríguez",
          },
        ];

        setMetrics(mockMetrics);
        setWarehouses(mockWarehouses);
        setMovements(mockMovements);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load warehouse logistics data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tenantId]);

  const updateFilters = (newFilters: Partial<WarehouseFilters>) => {
    setFilters((prev: WarehouseFilters) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      branch: "all",
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    });
  };

  const refetch = () => {
    setIsLoading(true);
    // Re-trigger the effect
    setMetrics(null);
    setMovements([]);
  };

  return {
    metrics,
    warehouses,
    movements,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    refetch,
  };
}
