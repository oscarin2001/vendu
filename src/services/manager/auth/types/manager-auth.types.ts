/**
 * Tipos de autenticación para managers
 */

export interface ManagerAuthPayload {
  managerId: number;
  authId: number;
  email: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  role: "MANAGER";
}

export interface ManagerLoginCredentials {
  email: string;
  password: string;
}

export interface ManagerLoginSuccess {
  ok: true;
  tenantId: string;
  redirectTo: string;
  manager: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ManagerLoginError {
  ok: false;
  error: string;
}

export type ManagerLoginResult = ManagerLoginSuccess | ManagerLoginError;

export interface ManagerSession {
  managerId: number;
  authId: number;
  email: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  branches: ManagerBranchAssignment[];
  warehouses: ManagerWarehouseAssignment[];
}

export interface ManagerBranchAssignment {
  id: number;
  name: string;
  address: string;
}

export interface ManagerWarehouseAssignment {
  id: number;
  name: string;
  city: string;
}
