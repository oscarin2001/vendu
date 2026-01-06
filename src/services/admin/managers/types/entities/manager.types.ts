/**
 * Manager status types
 */
export type ManagerStatus = "ACTIVE" | "DEACTIVATED" | "INACTIVE";
export type ConnectionStatus = "ONLINE" | "OFFLINE" | "AWAY" | "UNKNOWN";

/**
 * Manager entity interface
 */
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
  status: ManagerStatus;
  connectionStatus: ConnectionStatus;
  contributionType: "none" | "contributes" | "paid";
  branches: {
    id: number;
    name: string;
  }[];
  privilege: {
    name: string;
    code: string;
  };
  isActive: boolean;
  createdAt?: Date;
}
