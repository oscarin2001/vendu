// Mutation layer - Data modification operations
export * from "./create";
export * from "./update";
export * from "./delete";
export * from "./data/assign-manager";
export * from "./data/assign-branch";

// Backwards-compatible explicit exports
export { createWarehouseForCompany } from "./data/create-warehouse";
export { updateWarehouseForCompany } from "./data/update-warehouse";
export { deleteWarehouseForCompany } from "./data/delete-warehouse";
