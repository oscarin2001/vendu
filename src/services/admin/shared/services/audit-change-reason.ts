"use server";

import { prisma } from "@/lib/prisma";
import { AuditOperation, Prisma } from "@prisma/client";

export interface ChangeReasonAuditParams {
  /** Entity type: MANAGER, SUPPLIER, BRANCH, WAREHOUSE */
  entity: string;
  /** ID of the entity being modified */
  entityId: number;
  /** Operation type */
  action: "CREATE" | "UPDATE" | "DELETE";
  /** Previous values (for UPDATE/DELETE) */
  oldValue?: Record<string, unknown>;
  /** New values (for CREATE/UPDATE) */
  newValue?: Record<string, unknown>;
  /** User-provided reason for the change */
  changeReason: string;
  /** Employee making the change */
  employeeId?: number;
  /** Company ID for tenant isolation */
  companyId?: number;
  /** Client IP address */
  ipAddress?: string;
  /** Client user agent */
  userAgent?: string;
}

/**
 * Log a change with an explicit reason to the audit table
 * The reason is stored in the newValue JSON alongside the actual changes
 */
export async function logChangeWithReason(
  params: ChangeReasonAuditParams,
): Promise<void> {
  const {
    entity,
    entityId,
    action,
    oldValue,
    newValue,
    changeReason,
    employeeId,
    companyId,
    ipAddress,
    userAgent,
  } = params;

  // Embed the change reason in the newValue for persistence
  const enrichedNewValue = {
    ...newValue,
    _changeReason: changeReason,
    _changedAt: new Date().toISOString(),
  };

  try {
    await prisma.tbaudit_logs.create({
      data: {
        entity,
        entityId,
        action: action as AuditOperation,
        oldValue: oldValue
          ? (JSON.parse(JSON.stringify(oldValue)) as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        newValue: JSON.parse(
          JSON.stringify(enrichedNewValue),
        ) as Prisma.InputJsonValue,
        FK_employee: employeeId ?? null,
        FK_company: companyId ?? null,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("Error logging change with reason:", error);
    // Don't throw - audit failures shouldn't break the main operation
  }
}
