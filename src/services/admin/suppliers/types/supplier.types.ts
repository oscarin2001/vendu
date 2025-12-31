export interface Supplier {
  id: number;
  supplierNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  country: string | null;
  notes: string | null;
  isActive: boolean;
  manager: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateSupplierData {
  supplierNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  managerId?: number;
}

export interface UpdateSupplierData {
  supplierNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  managerId?: number;
}

export interface SupplierMetrics {
  total: number;
  active: number;
  withManager: number;
  withoutManager: number;
}

export interface SupplierFilters {
  search: string;
  status: "all" | "active" | "inactive";
  managerId?: number;
}

export interface SupplierFiltersState {
  search: string;
  status: "all" | "active" | "inactive";
  managerId?: number;
}
