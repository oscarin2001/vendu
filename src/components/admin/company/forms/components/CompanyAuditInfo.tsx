"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CompanyInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}

interface CompanyAuditInfoProps {
  companyInfo: CompanyInfo;
}

export function CompanyAuditInfo({ companyInfo }: CompanyAuditInfoProps) {
  return (
    <div className="mb-6">
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Información de Auditoría
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">ID de Empresa</Label>
              <p className="font-medium">#{companyInfo.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha de Creación</Label>
              <p className="font-medium">
                {new Date(companyInfo.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Última Actualización
              </Label>
              <p className="font-medium">
                {companyInfo.updatedAt
                  ? new Date(companyInfo.updatedAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "Nunca"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
