/**
 * Branch metrics interface
 */
export interface BranchMetrics {
  total: number;
  stores: number;
  warehouses: number;
  withManager: number;
  withoutManager: number;
}

/**
 * Branch filters state interface
 */
export interface BranchFiltersState {
  search: string;
  status: "all" | "withManager" | "withoutManager";
}
