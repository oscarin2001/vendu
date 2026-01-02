"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { History, User, Clock } from "lucide-react";
import { getBranchAuditLogs } from "@/services/admin/branches/branch-service";

interface AuditHistoryProps {
  entity: string;
  entityId: number;
  companyId?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface AuditLog {
  id: number;
  entity: string;
  entityId: number;
  action: string;
  oldValue: any;
  newValue: any;
  createdAt: string;
  employee: {
    id: number;
    name: string;
  } | null;
  ipAddress: string | null;
  userAgent: string | null;
}

const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

const formatAction = (action: string) => {
  switch (action) {
    case "CREATE":
      return { label: "Creado", variant: "default" as const };
    case "UPDATE":
      return { label: "Actualizado", variant: "secondary" as const };
    case "DELETE":
      return { label: "Eliminado", variant: "destructive" as const };
    default:
      return { label: action, variant: "outline" as const };
  }
};

const formatChanges = (oldValue: any, newValue: any) => {
  if (!oldValue && newValue) {
    // Creación
    return Object.entries(newValue).map(([key, value]) => ({
      field: key,
      old: null,
      new: value,
    }));
  }

  if (oldValue && !newValue) {
    // Eliminación
    return Object.entries(oldValue).map(([key, value]) => ({
      field: key,
      old: value,
      new: null,
    }));
  }

  if (oldValue && newValue) {
    // Actualización
    const changes: Array<{ field: string; old: any; new: any }> = [];
    const allKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);

    allKeys.forEach(key => {
      const oldVal = oldValue[key];
      const newVal = newValue[key];

      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes.push({
          field: key,
          old: oldVal,
          new: newVal,
        });
      }
    });

    return changes;
  }

  return [];
};

export function AuditHistory({
  entity,
  entityId,
  companyId,
  isOpen,
  onClose,
}: AuditHistoryProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && entity && entityId) {
      loadAuditHistory();
    }
  }, [isOpen, entity, entityId]);

  const loadAuditHistory = async () => {
    setIsLoading(true);
    try {
      let history;

      // Usar el servicio correspondiente según la entidad
      switch (entity) {
        case "BRANCH":
          history = await getBranchAuditLogs(entityId, companyId);
          break;
        default:
          throw new Error(`Unsupported entity type: ${entity}`);
      }

      setAuditLogs(history as AuditLog[]);
    } catch (error) {
      console.error("Error loading audit history:", error);
      // No mostrar error al usuario por ahora
    } finally {
      setIsLoading(false);
    }
  };

  const getEntityTitle = () => {
    switch (entity) {
      case "BRANCH":
        return "Sucursal";
      case "EMPLOYEE":
        return "Empleado";
      case "PRODUCT":
        return "Producto";
      default:
        return entity;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Cambios - {getEntityTitle()} #{entityId}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando historial...</div>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Sin historial</h3>
              <p>No se encontraron registros de cambios para esta entidad.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {auditLogs.map((log) => {
              const actionInfo = formatAction(log.action);
              const changes = formatChanges(log.oldValue, log.newValue);

              return (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={actionInfo.variant}>
                        {actionInfo.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                    {log.employee && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {log.employee.name}
                      </div>
                    )}
                  </div>

                  {changes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Cambios realizados:</h4>
                      <div className="bg-muted/50 rounded p-3">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-32">Campo</TableHead>
                              <TableHead>Anterior</TableHead>
                              <TableHead>Nuevo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {changes.map((change, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-sm">
                                  {change.field}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {change.old === null ? (
                                    <span className="text-muted-foreground italic">nulo</span>
                                  ) : (
                                    <span className="font-mono text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                                      {JSON.stringify(change.old)}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {change.new === null ? (
                                    <span className="text-muted-foreground italic">nulo</span>
                                  ) : (
                                    <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                      {JSON.stringify(change.new)}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}