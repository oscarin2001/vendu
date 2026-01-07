export interface InventoryData {
  id: string;
  productVariantId: string;
  branchId: string;
  warehouseId?: string;
  quantity: number;
  condition: "excellent" | "good" | "acceptable" | "damaged";
  lastUpdated: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description?: string;
}

export interface ProductCondition {
  condition: "excellent" | "good" | "acceptable" | "damaged";
  totalItems: number;
  percentage: number;
  totalValue: number;
}

export interface InventoryMetrics {
  totalItems: number;
  totalValue: number;
  activeBranches: number;
  activeWarehouses: number;
  stockByBranch: Array<{
    branchId: string;
    branchName: string;
    totalItems: number;
    itemCount: number;
    value: number;
  }>;
  stockByWarehouse: Array<{
    warehouseId: string;
    warehouseName: string;
    totalItems: number;
    itemCount: number;
    value: number;
    occupancyRate: number;
    location: string;
    capacity: number;
  }>;
  stockByCondition: {
    excellent: number;
    good: number;
    acceptable: number;
    damaged: number;
  };
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
  stockLevel: number;
  turnoverRate: number; // veces que rota por período
  lastSoldDate?: Date;
  imageUrl?: string;
  sku?: string;
}
