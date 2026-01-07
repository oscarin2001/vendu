export interface WarehouseMetrics {
  totalWarehouses: number;
  assignedWarehouses: number;
  unassignedWarehouses: number;
  totalCapacity: number;
  usedCapacity: number;
  averageOccupancy: number;
  warehousesByBranch: Array<{
    branchId: string;
    branchName: string;
    warehouseCount: number;
    totalCapacity: number;
    usedCapacity: number;
    occupancyRate: number;
    manager?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  }>;
}

export interface WarehouseMovement {
  id: string;
  type: "entry" | "transfer" | "adjustment";
  productId: string;
  productName: string;
  variantId: string;
  variantDetails: string;
  quantity: number;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  branchId: string;
  branchName: string;
  movementDate: Date;
  reason: string;
  performedBy: string;
  notes?: string;
}

export interface WarehouseFilters {
  type: "all" | "entry" | "transfer" | "adjustment";
  branch: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}
