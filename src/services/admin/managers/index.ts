// Types
export type {
  Manager,
  ManagerStatus,
  ConnectionStatus,
} from "./types/entities/manager.types";

export type {
  CreateManagerData,
  UpdateManagerData,
} from "./types/data-transfer/manager-data.types";

export type {
  ManagerMetrics,
  ManagerFiltersState,
} from "./types/ui/manager-ui.types";

export type { UserContext } from "./types/context/user-context.types";

// Validations
export {
  createManagerSchema,
  updateManagerSchema,
  managerFiltersSchema,
} from "./validations/schemas/manager-schema";

export type {
  CreateManagerData as CreateManagerDataInferred,
  UpdateManagerData as UpdateManagerDataInferred,
  ManagerFilters,
} from "./validations/types/inferred.types";

// Queries
export { getManagersByCompany } from "./queries/list/get-managers";
export { getManagerById } from "./queries/single/get-manager-by-id";

// Mutations
export {
  createManager,
  updateManager,
  deleteManager,
  toggleManagerStatus,
} from "./mutations/crud";
export { assignBranchToManager } from "./mutations/assignments/assign/assign-branch-to-manager";
export { removeBranchFromManager } from "./mutations/assignments/remove/remove-branch-from-manager";
export { validateAdminPassword } from "./mutations/security/validate-admin-password";

// Hooks
export { useManagers } from "./hooks/main/main/use-managers";
export { useManagerState } from "./hooks/data/use-manager-state";
export { useManagerFilters } from "./hooks/ui/use-manager-filters";
export { useManagerCrud } from "./hooks/actions/crud/use-manager-crud";
export { useManagerAssignments } from "./hooks/actions/assignments/use-manager-assignments";

// Utils
export {
  formatManagerName,
  formatManagerDisplay,
} from "./mappers/format-manager-name";
export { mapManagerFromDB } from "./mappers/manager-mapper";
