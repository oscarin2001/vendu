// ==================== QUERIES ====================
// Warehouse retrieval operations
export { getWarehousesByCompany, getWarehouseById } from './queries/get-warehouses';

// ==================== MUTATIONS ====================
// Warehouse CRUD operations
export { createWarehouse } from './mutations/create-warehouse';
export { updateWarehouse } from './mutations/update-warehouse';
export { deleteWarehouse } from './mutations/delete-warehouse';

// Warehouse assignment operations
export {
  assignManagerToWarehouse,
  removeManagerFromWarehouse
} from './mutations/assign-manager';

export {
  assignWarehouseToBranch,
  removeWarehouseFromBranch
} from './mutations/assign-branch';

// ==================== VALIDATIONS ====================
// Zod schemas and validation rules
export {
  createWarehouseSchema,
  updateWarehouseSchema,
  assignManagerSchema,
  assignBranchSchema,
  type CreateWarehouseData,
  type UpdateWarehouseData,
  type AssignManagerData,
  type AssignBranchData
} from './validations/warehouse-schema';

// ==================== TYPES ====================
// TypeScript type definitions
export type {
  Warehouse,
  WarehouseMetrics,
  WarehouseFilters
} from './types/warehouse.types';

// ==================== UTILS ====================
// Utility functions and helpers
export { normalizeWarehouseInput } from './utils/warehouse-utils';
export { useWarehouses } from './utils/useWarehouses';