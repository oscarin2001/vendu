// Types
export type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
  SupplierMetrics,
} from "./types/entities";
export type { SupplierFilters, SupplierFiltersState } from "./types/ui";

// Validations
export {
  createSupplierSchema,
  updateSupplierSchema,
} from "./validations/schemas";

// Queries
export { querySuppliersByCompany } from "./queries/suppliers";
export { querySupplierById } from "./queries/suppliers";

// Mutations
export { mutateCreateSupplier } from "./mutations/suppliers";
export { mutateUpdateSupplier } from "./mutations/suppliers";
export { mutateDeleteSupplier } from "./mutations/suppliers";
export {
  mutateAssignManagerToSupplier,
  mutateRemoveManagerFromSupplier,
} from "./mutations/suppliers";

// Alias exports for backward compatibility
export { mutateAssignManagerToSupplier as assignManagerToSupplier } from "./mutations/suppliers";
export { mutateRemoveManagerFromSupplier as removeManagerFromSupplier } from "./mutations/suppliers";

// Hooks
export { useSuppliers } from "./hooks/main";
export { useSupplierState } from "./hooks/data";
export { useSupplierFilters } from "./hooks/ui";
export { useSupplierOperations } from "./hooks/actions";

// Utils
export { formatSupplierName } from "./utils/format-supplier-name";
