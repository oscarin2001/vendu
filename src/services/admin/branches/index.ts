// Queries
export {
  getBranchesByCompany,
  getBranchAuditLogs,
} from "./queries/data/get-branches";

// Mutations
export { createBranch, updateBranch, deleteBranch } from "./mutations/crud";
export { assignManagerToBranch } from "./mutations/assignments/assign/assign-manager-to-branch";
export { removeManagerFromBranch } from "./mutations/assignments/remove/remove-manager-from-branch";

// Validations
export {
  createBranchSchema,
  updateBranchSchema,
  branchFiltersSchema,
} from "./validations/schemas/branch-schema";

export type {
  CreateBranchData as CreateBranchDataInferred,
  UpdateBranchData as UpdateBranchDataInferred,
  BranchFilters,
} from "./validations/types/inferred.types";

// Types
export type { Branch } from "./types/entities/branch.types";

export type {
  BranchMetrics,
  BranchFiltersState,
} from "./types/ui/branch-ui.types";

export type { UserContext } from "./types/context/user-context.types";

// Hooks
export { useBranches } from "./hooks/main/main/use-branches";
export { useBranchState } from "./hooks/data/use-branch-state";
export { useBranchFilters } from "./hooks/ui/use-branch-filters";
export { useBranchCrud } from "./hooks/actions/crud/use-branch-crud";
export { useBranchAssignments } from "./hooks/actions/assignments/use-branch-assignments";

// Utils
export { normalizeBranchInput } from "./mappers/branch-utils";
