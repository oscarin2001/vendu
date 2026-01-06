/**
 * Manager metrics interface
 */
export interface ManagerMetrics {
  total: number;
  active: number;
  deactivated: number;
  inactive: number;
  withBranch: number;
  withoutBranch: number;
}

/**
 * Manager filters state interface
 */
export interface ManagerFiltersState {
  search: string;
  branch: string;
  status: "all" | "active" | "deactivated" | "inactive";
}
