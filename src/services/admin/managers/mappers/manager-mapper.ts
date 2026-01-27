import type { Manager } from "../types/entities/manager.types";

/**
 * Maps a database manager record to the Manager interface
 * Handles status calculation and connection status determination
 */
export function mapManagerFromDB(manager: any): Manager {
  // Calcular isActive basado en status: ACTIVE = true, otros = false
  const isActive = manager.status === "ACTIVE";

  // Determinar estado de conexión basado en estado laboral
  let connectionStatus: "ONLINE" | "OFFLINE" | "AWAY" | "UNKNOWN" = "UNKNOWN";
  if (manager.status === "INACTIVE") {
    connectionStatus = "UNKNOWN"; // No aplica para inactivos
  } else if (manager.status === "DEACTIVATED") {
    connectionStatus = "OFFLINE"; // No puede acceder
  } else if (manager.status === "ACTIVE") {
    connectionStatus = "UNKNOWN"; // Estado desconocido por defecto
  }

  // Determinar contribution type basado en salary
  const contributionType: "none" | "contributes" | "paid" =
    !manager.salary || manager.salary.toNumber() === 0 ? "none" : "paid";

  return {
    id: manager.PK_employee,
    firstName: manager.firstName,
    lastName: manager.lastName,
    fullName: `${manager.firstName} ${manager.lastName}`,
    ci: manager.ci,
    phone: manager.phone,
    email: manager.auth.username,
    salary: manager.salary ? manager.salary.toNumber() : 0,
    hireDate: manager.hireDate,
    birthDate: manager.birthDate ?? undefined,
    joinedAt: manager.joinedAt ?? undefined,
    contractEndAt: manager.contractEndAt ?? undefined,
    homeAddress: manager.homeAddress ?? undefined,
    contractType: manager.contractType,
    status: manager.status,
    connectionStatus,
    contributionType,
    branches:
      manager.managerBranches?.map((mb: any) => ({
        id: mb.branch.PK_branch,
        name: mb.branch.name,
      })) || [],
    privilege: {
      name: manager.auth.privilege.privilegeName,
      code: manager.auth.privilege.privilegeCode,
    },
    isActive,
    createdAt: manager.createdAt,
    updatedAt: manager.updatedAt ?? undefined,
    createdBy: manager.createdBy
      ? {
          id: manager.createdBy.PK_employee,
          name: `${manager.createdBy.firstName} ${manager.createdBy.lastName}`,
        }
      : undefined,
    updatedBy: manager.updatedBy
      ? {
          id: manager.updatedBy.PK_employee,
          name: `${manager.updatedBy.firstName} ${manager.updatedBy.lastName}`,
        }
      : undefined,
  };
}
