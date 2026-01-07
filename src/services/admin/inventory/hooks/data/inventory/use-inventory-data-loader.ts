"use client";

import { useEffect, useState } from "react";
import type {
  InventoryData,
  InventoryMetrics,
  ProductPerformance,
  ProductCondition,
} from "../../../types";

export function useInventoryDataLoader(tenantId: string) {
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [productPerformance, setProductPerformance] = useState<
    ProductPerformance[]
  >([]);
  const [conditions, setConditions] = useState<ProductCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      loadInventoryData();
    }
  }, [tenantId]);

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement actual API calls
      // const inventory = await getInventoryByTenant(tenantId);
      // const calculatedMetrics = await getInventoryMetrics(tenantId);
      // const performance = await getProductPerformance(tenantId);

      // Mock data for now
      const mockInventory: InventoryData[] = [
        {
          id: "1",
          productVariantId: "pv1",
          branchId: "branch1",
          warehouseId: "warehouse1",
          quantity: 50,
          condition: "excellent",
          lastUpdated: new Date("2024-01-15"),
        },
        {
          id: "2",
          productVariantId: "pv2",
          branchId: "branch1",
          warehouseId: "warehouse1",
          quantity: 30,
          condition: "good",
          lastUpdated: new Date("2024-01-14"),
        },
        {
          id: "3",
          productVariantId: "pv3",
          branchId: "branch2",
          quantity: 20,
          condition: "acceptable",
          lastUpdated: new Date("2024-01-13"),
        },
        {
          id: "4",
          productVariantId: "pv4",
          branchId: "branch2",
          warehouseId: "warehouse2",
          quantity: 10,
          condition: "damaged",
          lastUpdated: new Date("2024-01-12"),
        },
        {
          id: "5",
          productVariantId: "pv5",
          branchId: "branch1",
          quantity: 75,
          condition: "excellent",
          lastUpdated: new Date("2024-01-11"),
        },
        {
          id: "6",
          productVariantId: "pv6",
          branchId: "branch3",
          warehouseId: "warehouse1",
          quantity: 25,
          condition: "good",
          lastUpdated: new Date("2024-01-10"),
        },
        {
          id: "7",
          productVariantId: "pv7",
          branchId: "branch3",
          quantity: 15,
          condition: "acceptable",
          lastUpdated: new Date("2024-01-09"),
        },
        {
          id: "8",
          productVariantId: "pv8",
          branchId: "branch2",
          warehouseId: "warehouse2",
          quantity: 5,
          condition: "damaged",
          lastUpdated: new Date("2024-01-08"),
        },
      ];
      const mockMetrics: InventoryMetrics = {
        totalItems: 230,
        totalValue: 115000,
        activeBranches: 3,
        activeWarehouses: 2,
        stockByBranch: [
          {
            branchId: "branch1",
            branchName: "Sucursal Centro",
            totalItems: 155,
            itemCount: 155,
            value: 77500,
          },
          {
            branchId: "branch2",
            branchName: "Sucursal Norte",
            totalItems: 35,
            itemCount: 35,
            value: 17500,
          },
          {
            branchId: "branch3",
            branchName: "Sucursal Sur",
            totalItems: 40,
            itemCount: 40,
            value: 20000,
          },
        ],
        stockByWarehouse: [
          {
            warehouseId: "warehouse1",
            warehouseName: "Almacén Principal",
            totalItems: 105,
            itemCount: 105,
            value: 52500,
            occupancyRate: 75,
            location: "Centro",
            capacity: 500,
          },
          {
            warehouseId: "warehouse2",
            warehouseName: "Almacén Secundario",
            totalItems: 15,
            itemCount: 15,
            value: 7500,
            occupancyRate: 45,
            location: "Norte",
            capacity: 300,
          },
        ],
        stockByCondition: {
          excellent: 125,
          good: 55,
          acceptable: 35,
          damaged: 15,
        },
      };
      const mockPerformance: ProductPerformance[] = [
        {
          productId: "p1",
          productName: "Camisa Casual Azul",
          totalSold: 45,
          totalRevenue: 22500,
          averagePrice: 500,
          stockLevel: 25,
          turnoverRate: 1.8,
          lastSoldDate: new Date("2024-01-14"),
          imageUrl: "/images/products/camisa-azul.jpg",
          sku: "CAM-AZUL-M",
        },
        {
          productId: "p2",
          productName: "Pantalón Jeans Negro",
          totalSold: 32,
          totalRevenue: 25600,
          averagePrice: 800,
          stockLevel: 18,
          turnoverRate: 1.78,
          lastSoldDate: new Date("2024-01-13"),
          imageUrl: "/images/products/pantalon-negro.jpg",
          sku: "PAN-NEGRO-32",
        },
        {
          productId: "p3",
          productName: "Vestido Elegante Rojo",
          totalSold: 28,
          totalRevenue: 19600,
          averagePrice: 700,
          stockLevel: 12,
          turnoverRate: 2.33,
          lastSoldDate: new Date("2024-01-12"),
          imageUrl: "/images/products/vestido-rojo.jpg",
          sku: "VES-ROJO-S",
        },
        {
          productId: "p4",
          productName: "Chaqueta Cuero Marrón",
          totalSold: 15,
          totalRevenue: 22500,
          averagePrice: 1500,
          stockLevel: 8,
          turnoverRate: 1.88,
          lastSoldDate: new Date("2024-01-08"),
          imageUrl: "/images/products/chaqueta-marron.jpg",
          sku: "CHA-MARRON-L",
        },
        {
          productId: "p5",
          productName: "Zapatos Deportivos Blancos",
          totalSold: 8,
          totalRevenue: 6400,
          averagePrice: 800,
          stockLevel: 22,
          turnoverRate: 0.36,
          lastSoldDate: new Date("2023-12-20"),
          imageUrl: "/images/products/zapatos-blancos.jpg",
          sku: "ZAP-BLANCO-42",
        },
        {
          productId: "p6",
          productName: "Blusa Estampada Verde",
          totalSold: 5,
          totalRevenue: 2500,
          averagePrice: 500,
          stockLevel: 15,
          turnoverRate: 0.33,
          lastSoldDate: new Date("2023-12-15"),
          imageUrl: "/images/products/blusa-verde.jpg",
          sku: "BLU-VERDE-M",
        },
      ];

      // Calcular condiciones basadas en los datos de inventario
      const totalItems = mockInventory.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const conditionsCount = mockInventory.reduce((acc, item) => {
        acc[item.condition] = (acc[item.condition] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

      const mockConditions: ProductCondition[] = Object.entries(
        conditionsCount
      ).map(([condition, count]) => {
        // Valores estimados por condición (excellent = 100%, good = 80%, acceptable = 60%, damaged = 30%)
        const valueMultiplier =
          condition === "excellent"
            ? 1
            : condition === "good"
            ? 0.8
            : condition === "acceptable"
            ? 0.6
            : 0.3;
        const averagePrice = 600; // precio promedio estimado
        const totalValue = count * averagePrice * valueMultiplier;

        return {
          condition: condition as
            | "excellent"
            | "good"
            | "acceptable"
            | "damaged",
          totalItems: count,
          percentage: (count / totalItems) * 100,
          totalValue: totalValue,
        };
      });

      setInventoryData(mockInventory);
      setMetrics(mockMetrics);
      setProductPerformance(mockPerformance);
      setConditions(mockConditions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading inventory data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inventoryData,
    metrics,
    productPerformance,
    conditions,
    isLoading,
    error,
    refetch: loadInventoryData,
  };
}
