"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, FileText, Eye, Edit, Calendar } from "lucide-react";
import {
  CompanyData,
  SubscriptionData,
} from "@/services/admin/company/types/company.types";

interface CompanyOverviewProps {
  company: CompanyData | null;
  subscription: SubscriptionData | null;
  isLoading: boolean;
  onViewDetails: () => void;
  onEdit: () => void;
}

export function CompanyOverview({
  company,
  subscription,
  isLoading,
  onViewDetails,
  onEdit,
}: CompanyOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No se encontró información de la empresa.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toUpperCase()) {
      case "BASIC":
        return "bg-blue-100 text-blue-800";
      case "PRO":
        return "bg-purple-100 text-purple-800";
      case "ENTERPRISE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nombre de la Empresa
            </label>
            <p className="text-lg font-semibold">{company.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              ID Fiscal
            </label>
            <p className="text-lg font-semibold">{company.taxId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              País
            </label>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {company.country}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Slug/Tenant ID
            </label>
            <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
              {company.slug}
            </p>
          </div>
        </div>

        {/* Suscripción */}
        {subscription && (
          <>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Suscripción Actual
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPlanColor(subscription.plan)}>
                      {subscription.plan}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Próximo Pago
                  </label>
                  <p className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {subscription.nextPaymentDate}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Monto
                  </label>
                  <p className="text-lg font-semibold text-green-600 mt-1">
                    ${subscription.amount}/mes
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Información de Auditoría */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Información de Auditoría
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Creada</label>
              <p className="font-medium">
                {new Date(company.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="text-muted-foreground">
                Última actualización
              </label>
              <p className="font-medium">
                {company.updatedAt
                  ? new Date(company.updatedAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Nunca"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
