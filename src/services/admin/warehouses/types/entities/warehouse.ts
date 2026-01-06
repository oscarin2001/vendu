/**
 * Core warehouse entity types
 * Defines the fundamental data structures for warehouse management
 */

export interface Warehouse {
  id: number;
  name: string;
  phone?: string;
  address: string;
  city: string;
  department?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date | undefined;
}

export interface WarehouseWithRelations extends Warehouse {
  managers: WarehouseManager[];
  branches: WarehouseBranch[];
}

export interface WarehouseManager {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface WarehouseBranch {
  id: number;
  name: string;
  address: string;
  isPrimary: boolean;
}

export interface WarehouseAssignment {
  id: number;
  warehouseId: number;
  assignedAt: Date;
}
