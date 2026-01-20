"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BranchInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
}

interface BranchAuditInfoProps {
  branchInfo: BranchInfo;
}

export function BranchAuditInfo({ branchInfo }: BranchAuditInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Información del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID:</span>{" "}
            <span className="font-medium">{branchInfo.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Creado:</span>{" "}
            <span className="font-medium">
              {new Date(branchInfo.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {branchInfo.createdBy && (
            <div>
              <span className="text-muted-foreground">Creado por:</span>{" "}
              <span className="font-medium">{branchInfo.createdBy.name}</span>
            </div>
          )}
          {branchInfo.updatedAt && (
            <div>
              <span className="text-muted-foreground">Modificado:</span>{" "}
              <span className="font-medium">
                {new Date(branchInfo.updatedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {branchInfo.updatedBy && (
            <div>
              <span className="text-muted-foreground">Modificado por:</span>{" "}
              <span className="font-medium">{branchInfo.updatedBy.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
