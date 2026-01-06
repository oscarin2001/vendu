"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BranchInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
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
            <span className="font-medium">ID:</span> {branchInfo.id}
          </div>
          <div>
            <span className="font-medium">Creado:</span>{" "}
            {new Date(branchInfo.createdAt).toLocaleDateString("es-ES")}
          </div>
          {branchInfo.updatedAt && (
            <div className="col-span-2">
              <span className="font-medium">Última modificación:</span>{" "}
              {new Date(branchInfo.updatedAt).toLocaleDateString("es-ES")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
