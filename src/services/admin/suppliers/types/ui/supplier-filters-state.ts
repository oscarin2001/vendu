export interface SupplierFiltersState {
  search: string;
  status: "all" | "active" | "inactive";
  managerId?: number;
}
