// Ultra-fragmented warehouses service
// Following enterprise architecture patterns with maximum separation of concerns

// Repository layer - Database operations
export * from "./repos";

// Services layer - Business logic and validation
export * from "./services/logic";
export * from "./services/validation";

// Query layer - Data retrieval
export * from "./queries";

// Mutation layer - Data modification
export * from "./mutations";

// Hooks - React hooks for UI integration
export * from "./hooks";

// Types - Domain entities and UI types
export * from "./types/entities";
export * from "./types/ui";
export * from "./validations/schemas";
export * from "./validations/types";

// Hooks - React state management
export * from "./hooks/data";
export * from "./hooks/ui";
export * from "./hooks/actions";
export * from "./hooks/main";

// API - Backward compatible public interface (explicit exports to avoid conflicts)
export {
  getWarehousesByCompany,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  assignManagerToWarehouse,
  removeManagerFromWarehouse,
  assignWarehouseToBranch,
  removeWarehouseFromBranch,
} from "./api";
