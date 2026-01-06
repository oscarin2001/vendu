"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AuditHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  entityId?: string;
  entityType?: string;
}

export function AuditHistory({
  isOpen,
  onClose,
  entityId,
  entityType,
}: AuditHistoryProps) {
  // Mock data - en una implementación real esto vendría de un servicio
  const auditLogs = [
    {
      id: "1",
      action: "CREATE",
      user: "Admin User",
      timestamp: new Date(),
      details: "Entidad creada",
    },
    {
      id: "2",
      action: "UPDATE",
      user: "Admin User",
      timestamp: new Date(Date.now() - 86400000),
      details: "Información actualizada",
    },
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historial de Auditoría</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96">
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay registros de auditoría disponibles
              </p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.user}
                      </span>
                    </div>
                    <p className="text-sm">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(log.timestamp, "PPpp", { locale: es })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
