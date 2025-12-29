    "use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, FileText, Edit } from "lucide-react";

interface CompanyOverviewProps {
  companyData: {
    name: string;
    taxId?: string;
    country: string;
    address?: string;
  };
  onEdit: () => void;
}

export function CompanyOverview({ companyData, onEdit }: CompanyOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Información de la Empresa
          </CardTitle>
          <p className="text-muted-foreground">
            Vista general de los datos de tu empresa
          </p>
        </div>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Empresa
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Nombre de la Empresa
            </div>
            <div className="text-lg font-semibold">{companyData.name}</div>
          </div>

          {companyData.taxId && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                NIT
              </div>
              <div className="text-lg font-semibold">{companyData.taxId}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              País
            </div>
            <Badge variant="secondary" className="text-sm">
              {companyData.country}
            </Badge>
          </div>

          {companyData.address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Dirección
              </div>
              <div className="text-sm">{companyData.address}</div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mantén actualizada la información de tu empresa para una mejor
            experiencia en la plataforma.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
