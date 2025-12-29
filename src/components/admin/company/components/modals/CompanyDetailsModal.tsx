"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, FileText, Calendar, Clock } from "lucide-react";
import {
  CompanyData,
  SubscriptionData,
} from "@/services/admin/company/types/company.types";

interface CompanyDetailsModalProps {
  company: CompanyData | null;
  subscription: SubscriptionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsModal({
  company,
  subscription,
  isOpen,
  onClose,
}: CompanyDetailsModalProps) {
  if (!company) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Detalles de la Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Información de Auditoría */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Información de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(company.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Última Actualización
                  </label>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {company.updatedAt
                      ? new Date(company.updatedAt).toLocaleDateString(
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

          {/* Suscripción */}
          {subscription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suscripción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Plan
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge className={getPlanColor(subscription.plan)}>
                        {subscription.plan}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Próximo Pago
                    </label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {subscription.nextPaymentDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Monto
                    </label>
                    <p className="text-lg font-semibold text-green-600">
                      ${subscription.amount}/mes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* ID de la Empresa */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">ID de Empresa</p>
            <p className="text-2xl font-mono font-bold">#{company.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
