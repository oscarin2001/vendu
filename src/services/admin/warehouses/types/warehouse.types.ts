export interface Warehouse {
  id: number;
  name: string;
  phone: string | null;
  address: string;
  city: string;
  department: string | null;
  country: string | null;
  managers: {
    id: number;
    name: string;
    email?: string;
  }[];
  branches: {
    id: number;
    name: string;
    isPrimary: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date | undefined;
}

export interface WarehouseMetrics {
  total: number;
  withManager: number;
  withoutManager: number;
  totalBranches: number;
  unassignedManagers: number;
}

export type WarehouseFilters = "all" | "withManager" | "withoutManager";
