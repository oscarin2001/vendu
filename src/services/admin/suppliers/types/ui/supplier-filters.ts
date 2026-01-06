export interface SupplierFilters {
  search: string;
  status: "all" | "active" | "inactive";
  managerId?: number;
}
