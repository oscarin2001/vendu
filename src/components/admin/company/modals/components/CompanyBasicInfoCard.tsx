"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Hash } from "lucide-react";
import { CompanyData } from "@/services/admin/company";

interface CompanyBasicInfoCardProps {
  company: CompanyData;
}

export function CompanyBasicInfoCard({ company }: CompanyBasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nombre
            </label>
            <p className="text-lg font-semibold">{company.name}</p>
          </div>

          {company.taxId && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" />
                ID Fiscal / NIT
              </label>
              <p className="font-mono">{company.taxId}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              País
            </label>
            <p>{company.country}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
