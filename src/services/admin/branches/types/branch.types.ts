export interface Branch {
  id: number;
  name: string;
  isWarehouse: boolean;
  phone: string | null;
  address: string;
  city: string;
  department: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: any;
  managers: {
    id: number;
    name: string;
    email: string;
  }[];
  suppliers: {
    id: number;
    supplierNumber: string;
    name: string;
    email: string | null;
  }[];
  manager: {
    id: number;
    name: string;
    email: string;
  } | null; // Para compatibilidad con código existente
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: {
    id: number;
    name: string;
  };
  updatedBy?: {
    id: number;
    name: string;
  };
}

export interface BranchMetrics {
  total: number;
  stores: number;
  warehouses: number;
  withManager: number;
  withoutManager: number;
}

export type BranchFilters = "all" | "stores" | "warehouses";

export interface BranchFiltersState {
  search: string;
  type: BranchFilters;
  status: "all" | "active" | "inactive";
}
