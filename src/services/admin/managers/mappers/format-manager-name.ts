import type { Manager } from "../types/entities/manager.types";

/**
 * Formats a manager's full name
 */
export function formatManagerName(manager: Manager): string {
  return `${manager.firstName} ${manager.lastName}`;
}

/**
 * Formats a manager's display name with CI
 */
export function formatManagerDisplay(manager: Manager): string {
  return `${formatManagerName(manager)} (${manager.ci})`;
}
