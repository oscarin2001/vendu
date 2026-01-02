import { PrismaClient, AuditOperation } from "@prisma/client";

export interface AuditLogData {
  entity: string;
  entityId: number;
  action: AuditOperation;
  oldValue?: any;
  newValue?: any;
  employeeId?: number;
  companyId?: number;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Registra una acción de auditoría
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.tbaudit_logs.create({
        data: {
          entity: data.entity,
          entityId: data.entityId,
          action: data.action,
          oldValue: data.oldValue
            ? JSON.parse(JSON.stringify(data.oldValue))
            : null,
          newValue: data.newValue
            ? JSON.parse(JSON.stringify(data.newValue))
            : null,
          FK_employee: data.employeeId || null,
          FK_company: data.companyId || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch (error) {
      // Log del error pero no fallar la operación principal
      console.error("Error logging audit:", error);
    }
  }

  /**
   * Registra la creación de una entidad
   */
  async logCreate(
    entity: string,
    entityId: number,
    newValue: any,
    context?: {
      employeeId?: number;
      companyId?: number;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await this.log({
      entity,
      entityId,
      action: AuditOperation.CREATE,
      newValue,
      ...context,
    });
  }

  /**
   * Registra la actualización de una entidad
   */
  async logUpdate(
    entity: string,
    entityId: number,
    oldValue: any,
    newValue: any,
    context?: {
      employeeId?: number;
      companyId?: number;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await this.log({
      entity,
      entityId,
      action: AuditOperation.UPDATE,
      oldValue,
      newValue,
      ...context,
    });
  }

  /**
   * Registra la eliminación de una entidad
   */
  async logDelete(
    entity: string,
    entityId: number,
    oldValue: any,
    context?: {
      employeeId?: number;
      companyId?: number;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await this.log({
      entity,
      entityId,
      action: AuditOperation.DELETE,
      oldValue,
      ...context,
    });
  }

  /**
   * Obtiene el historial de auditoría para una entidad específica
   */
  async getEntityHistory(entity: string, entityId: number, companyId?: number) {
    const where: any = {
      entity,
      entityId,
    };

    if (companyId) {
      where.FK_company = companyId;
    }

    return this.prisma.tbaudit_logs.findMany({
      where,
      include: {
        employee: {
          select: {
            PK_employee: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Obtiene la información de última actualización para una entidad específica
   */
  async getLastUpdate(entity: string, entityId: number, companyId?: number) {
    const where: any = {
      entity,
      entityId,
      action: { in: ["UPDATE", "CREATE"] },
    };

    if (companyId) {
      where.FK_company = companyId;
    }

    const lastLog = await this.prisma.tbaudit_logs.findFirst({
      where,
      include: {
        employee: {
          select: {
            PK_employee: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return lastLog
      ? {
          updatedAt: lastLog.createdAt,
          updatedBy: lastLog.employee
            ? {
                id: lastLog.employee.PK_employee,
                name: `${lastLog.employee.firstName} ${lastLog.employee.lastName}`,
              }
            : null,
        }
      : null;
  }

  /**
   * Obtiene el historial de auditoría para una entidad específica
   */
  async getAuditLogs(params: {
    entityType: string;
    entityId: number;
    companyId?: number;
    limit?: number;
    offset?: number;
  }) {
    const { entityType, entityId, companyId, limit = 50, offset = 0 } = params;

    const where: any = {
      entity: entityType,
      entityId,
    };

    if (companyId) {
      where.FK_company = companyId;
    }

    const auditLogs = await this.prisma.tbaudit_logs.findMany({
      where,
      include: {
        employee: {
          select: {
            PK_employee: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    return auditLogs.map((log) => ({
      id: log.PK_log,
      entity: log.entity,
      entityId: log.entityId,
      action: log.action,
      oldValue: log.oldValue,
      newValue: log.newValue,
      createdAt: log.createdAt.toISOString(),
      employee: log.employee
        ? {
            id: log.employee.PK_employee,
            name: `${log.employee.firstName} ${log.employee.lastName}`,
          }
        : null,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    }));
  }

  /**
   * Obtiene estadísticas de auditoría para un período
   */
  async getAuditStats(companyId?: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      createdAt: {
        gte: startDate,
      },
    };

    if (companyId) {
      where.FK_company = companyId;
    }

    const stats = await this.prisma.tbaudit_logs.groupBy({
      by: ["action", "entity"],
      where,
      _count: {
        PK_log: true,
      },
    });

    return stats.reduce((acc, stat) => {
      const key = `${stat.action}_${stat.entity}`;
      acc[key] = stat._count.PK_log;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Determina si una entidad está activa basada en la auditoría
   * Una entidad se considera inactiva si su último evento de auditoría es DELETE
   */
  async isEntityActive(
    entity: string,
    entityId: number,
    companyId?: number
  ): Promise<boolean> {
    const where: any = {
      entity,
      entityId,
    };

    if (companyId) {
      where.FK_company = companyId;
    }

    const lastAuditLog = await this.prisma.tbaudit_logs.findFirst({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        action: true,
      },
    });

    // Si no hay registros de auditoría, se considera activo (recién creado)
    if (!lastAuditLog) {
      return true;
    }

    // Si el último evento es DELETE, está inactivo
    return lastAuditLog.action !== AuditOperation.DELETE;
  }
}

// Instancia singleton del servicio de auditoría
let auditService: AuditService;

export function getAuditService(prisma?: PrismaClient): AuditService {
  if (!auditService) {
    if (!prisma) {
      throw new Error(
        "Prisma client is required for audit service initialization"
      );
    }
    auditService = new AuditService(prisma);
  }
  return auditService;
}
