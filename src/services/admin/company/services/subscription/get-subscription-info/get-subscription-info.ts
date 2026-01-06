/**
 * Servicio para gestionar la suscripción y plan de la empresa.
 * Maneja upgrades, downgrades, pagos, etc.
 */

export interface SubscriptionInfo {
  plan: "BASIC" | "PRO" | "ENTERPRISE";
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  nextPaymentDate?: Date;
  amount?: number;
}

export async function getSubscriptionInfo(
  companyId: string
): Promise<SubscriptionInfo> {
  // TODO: Obtener info de suscripción
  throw new Error("getSubscriptionInfo not implemented yet");
}
