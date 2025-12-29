/**
 * Servicio para gestionar la suscripción y plan de la empresa.
 * Maneja upgrades, downgrades, pagos, etc.
 */

export interface SubscriptionInfo {
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  nextPaymentDate?: Date;
  amount?: number;
}

export async function getSubscriptionInfo(companyId: string): Promise<SubscriptionInfo> {
  // TODO: Obtener info de suscripción
  throw new Error("getSubscriptionInfo not implemented yet");
}

export async function upgradePlan(companyId: string, newPlan: string) {
  // TODO: Implementar upgrade
  throw new Error("upgradePlan not implemented yet");
}

export async function cancelSubscription(companyId: string) {
  // TODO: Implementar cancelación
  throw new Error("cancelSubscription not implemented yet");
}