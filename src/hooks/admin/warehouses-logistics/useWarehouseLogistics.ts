"use client";

import { useState, useEffect } from "react";
import {
  Warehouse,
  WarehouseMovement,
  WarehouseMetrics,
} from "@/services/admin/warehouses-logistics/types";

// Mock data for warehouses
const mockWarehouses: Warehouse[] = [
  {
    id: "1",
    branchName: "Sucursal Centro",
    location: "Av. Providencia 123, Santiago",
    type: "Principal",
    totalCapacity: 10000,
    usedCapacity: 7500,
    currentOccupancy: 75,
    totalProducts: 1250,
    activeMovements: 8,
    managerName: "Carlos Mendoza",
    managerEmail: "carlos.mendoza@empresa.com",
    managerPhone: "+56912345678",
  },
  {
    id: "2",
    branchName: "Sucursal Norte",
    location: "Av. Las Condes 456, Santiago",
    type: "Secundaria",
    totalCapacity: 8000,
    usedCapacity: 5200,
    currentOccupancy: 65,
    totalProducts: 980,
    activeMovements: 5,
    managerName: "Ana García",
    managerEmail: "ana.garcia@empresa.com",
    managerPhone: "+56987654321",
  },
  {
    id: "3",
    branchName: "Sucursal Sur",
    location: "Av. Kennedy 789, Santiago",
    type: "Secundaria",
    totalCapacity: 6000,
    usedCapacity: 4800,
    currentOccupancy: 80,
    totalProducts: 750,
    activeMovements: 12,
    managerName: "Pedro López",
    managerEmail: "pedro.lopez@empresa.com",
    managerPhone: "+56955556666",
  },
  {
    id: "4",
    branchName: "Sucursal Este",
    location: "Av. La Florida 321, Santiago",
    type: "Distribución",
    totalCapacity: 12000,
    usedCapacity: 9600,
    currentOccupancy: 80,
    totalProducts: 1800,
    activeMovements: 15,
    managerName: "María Rodríguez",
    managerEmail: "maria.rodriguez@empresa.com",
    managerPhone: "+56944443333",
  },
  {
    id: "5",
    branchName: "Sucursal Oeste",
    location: "Av. Vitacura 654, Santiago",
    type: "Almacén",
    totalCapacity: 15000,
    usedCapacity: 12000,
    currentOccupancy: 80,
    totalProducts: 2200,
    activeMovements: 20,
    managerName: "Juan Silva",
    managerEmail: "juan.silva@empresa.com",
    managerPhone: "+56977778888",
  },
];

// Mock data for movements
const mockMovements: WarehouseMovement[] = [
  {
    id: "1",
    type: "entry",
    productId: "prod_001",
    productName: "iPhone 15 Pro",
    variantId: "var_001",
    variantDetails: "128GB - Negro",
    quantity: 50,
    toWarehouseId: "wh_001",
    branchId: "branch_001",
    branchName: "Sucursal Centro",
    movementDate: new Date("2024-12-20T10:00:00"),
    reason: "Compra proveedor",
    performedBy: "Carlos Rodríguez",
    notes: "Entrega programada",
  },
  {
    id: "2",
    type: "adjustment",
    productId: "prod_002",
    productName: "AirPods Pro",
    variantId: "var_002",
    variantDetails: "2nd Gen",
    quantity: -30,
    fromWarehouseId: "wh_001",
    branchId: "branch_001",
    branchName: "Sucursal Centro",
    movementDate: new Date("2024-12-19T09:15:00"),
    reason: "Venta",
    performedBy: "María González",
  },
  {
    id: "3",
    type: "transfer",
    productId: "prod_003",
    productName: "iPad Air",
    variantId: "var_003",
    variantDetails: "64GB - WiFi",
    quantity: 20,
    fromWarehouseId: "wh_001",
    toWarehouseId: "wh_002",
    branchId: "branch_001",
    branchName: "Sucursal Centro",
    movementDate: new Date("2024-12-18T11:30:00"),
    reason: "Reubicación de inventario",
    performedBy: "Carlos Rodríguez",
  },
  {
    id: "4",
    type: "entry",
    productId: "prod_004",
    productName: "Mac Mini M2",
    variantId: "var_004",
    variantDetails: "512GB",
    quantity: 10,
    toWarehouseId: "wh_004",
    branchId: "branch_004",
    branchName: "Sucursal Este",
    movementDate: new Date("2024-12-17T08:00:00"),
    reason: "Compra proveedor",
    performedBy: "Ana López",
  },
  {
    id: "5",
    type: "adjustment",
    productId: "prod_005",
    productName: "Apple TV 4K",
    variantId: "var_005",
    variantDetails: "128GB",
    quantity: -25,
    fromWarehouseId: "wh_003",
    branchId: "branch_003",
    branchName: "Sucursal Sur",
    movementDate: new Date("2024-12-16T14:20:00"),
    reason: "Venta mayorista",
    performedBy: "Pedro Sánchez",
  },
];

// Mock data for metrics
const mockMetrics: WarehouseMetrics = {
  totalWarehouses: 5,
  assignedWarehouses: 4,
  unassignedWarehouses: 1,
  totalCapacity: 51000,
  usedCapacity: 36100,
  averageOccupancy: 70.8,
  warehousesByBranch: [
    {
      branchId: "branch_001",
      branchName: "Sucursal Centro",
      warehouseCount: 2,
      totalCapacity: 15000,
      usedCapacity: 12000,
      occupancyRate: 80.0,
      manager: {
        id: "mgr_001",
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@company.com",
        phone: "+56912345678",
      },
    },
    {
      branchId: "branch_002",
      branchName: "Sucursal Norte",
      warehouseCount: 1,
      totalCapacity: 12000,
      usedCapacity: 8500,
      occupancyRate: 70.8,
      manager: {
        id: "mgr_002",
        name: "María González",
        email: "maria.gonzalez@company.com",
        phone: "+56987654321",
      },
    },
    {
      branchId: "branch_003",
      branchName: "Sucursal Sur",
      warehouseCount: 1,
      totalCapacity: 10000,
      usedCapacity: 7200,
      occupancyRate: 72.0,
    },
    {
      branchId: "branch_004",
      branchName: "Sucursal Este",
      warehouseCount: 1,
      totalCapacity: 14000,
      usedCapacity: 8400,
      occupancyRate: 60.0,
      manager: {
        id: "mgr_003",
        name: "Ana López",
        email: "ana.lopez@company.com",
        phone: "+56911223344",
      },
    },
  ],
};

export function useWarehouseLogistics() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [movements, setMovements] = useState<WarehouseMovement[]>([]);
  const [metrics, setMetrics] = useState<WarehouseMetrics | null>(null);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true);
  const [isLoadingMovements, setIsLoadingMovements] = useState(true);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const loadWarehouses = async () => {
      setIsLoadingWarehouses(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setWarehouses(mockWarehouses);
      setIsLoadingWarehouses(false);
    };

    const loadMovements = async () => {
      setIsLoadingMovements(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMovements(mockMovements);
      setIsLoadingMovements(false);
    };

    const loadMetrics = async () => {
      setIsLoadingMetrics(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMetrics(mockMetrics);
      setIsLoadingMetrics(false);
    };

    loadWarehouses();
    loadMovements();
    loadMetrics();
  }, []);

  return {
    warehouses,
    movements,
    metrics,
    isLoadingWarehouses,
    isLoadingMovements,
    isLoadingMetrics,
  };
}
