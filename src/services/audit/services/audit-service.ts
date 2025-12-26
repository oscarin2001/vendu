// Audit service: registrar acciones críticas en tbaudit_logs

export async function logAudit(_payload: {
  action: string;
  entity: string;
  entityId?: number;
  actor?: any;
  before?: any;
  after?: any;
}) {
  // Implementar inserción en tbaudit_logs
  throw new Error("audit-service.log not implemented");
}
