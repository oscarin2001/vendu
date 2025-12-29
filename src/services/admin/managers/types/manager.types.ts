export interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  ci: string;
  phone: string | null;
  email: string;
  salary: number;
  hireDate: Date;
  branch: {
    id: number;
    name: string;
    isWarehouse: boolean;
  } | null;
  privilege: {
    name: string;
    code: string;
  };
}

export interface CreateManagerData {
  firstName: string;
  lastName: string;
  ci: string;
  phone?: string;
  email: string;
  password: string;
  salary?: number;
  branchId?: number;
}

export interface UpdateManagerData {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  salary?: number;
  branchId?: number;
}

export interface ManagerMetrics {
  total: number;
  active: number;
  withBranch: number;
  withoutBranch: number;
}

export interface ManagerFilters {
  search: string;
  branch: string;
  status: "all" | "active" | "inactive";
}
