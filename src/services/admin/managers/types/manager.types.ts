export type ManagerStatus = "ACTIVE" | "DEACTIVATED" | "INACTIVE";
export type ConnectionStatus = "ONLINE" | "OFFLINE" | "AWAY" | "UNKNOWN";

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
  contractType: string;
  status: ManagerStatus; // Nuevo campo de estado
  connectionStatus: ConnectionStatus; // Estado de conexión
  contributionType: "none" | "contributes" | "paid"; // Tipo de contribución financiera
  branches: {
    id: number;
    name: string;
  }[];
  privilege: {
    name: string;
    code: string;
  };
  isActive: boolean; // Mantener para compatibilidad, calculado desde status
  createdAt?: Date; // Fecha de creación de la cuenta (de tbauth)
}

export interface CreateManagerData {
  firstName: string;
  lastName: string;
  ci: string;
  phone?: string;
  email: string;
  password: string;
  salary?: number;
  branchIds: number[];
  contributionType: "none" | "contributes" | "paid";
  hireDate?: Date;
}

export interface UpdateManagerData {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  salary?: number;
  branchIds?: number[];
  contributionType?: "none" | "contributes" | "paid";
  hireDate?: Date;
}

export interface ManagerMetrics {
  total: number;
  active: number;
  deactivated: number;
  inactive: number;
  withBranch: number;
  withoutBranch: number;
}

export interface ManagerFilters {
  search: string;
  branch: string;
  status: "all" | "active" | "deactivated" | "inactive";
}
