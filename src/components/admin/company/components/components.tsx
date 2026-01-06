import { CompanyData, SubscriptionData } from "@/services/admin/company";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Edit, Eye, Calendar, User } from "lucide-react";

interface CompanyOverviewHeaderProps {
  onViewDetails: () => void;
  onEdit: () => void;
}

export function CompanyOverviewHeader({
  onViewDetails,
  onEdit,
}: CompanyOverviewHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 pb-0">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Información de la Empresa</h3>
      </div>
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
  );
}

interface CompanyBasicInfoProps {
  company: CompanyData;
}

export function CompanyBasicInfo({ company }: CompanyBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Información Básica</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{company.name}</p>
          </div>
          {company.taxId && (
            <div>
              <p className="text-sm text-muted-foreground">ID Fiscal</p>
              <p className="font-medium">{company.taxId}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">País</p>
            <p className="font-medium">{company.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CompanySubscriptionInfoProps {
  subscription: SubscriptionData;
}

export function CompanySubscriptionInfo({
  subscription,
}: CompanySubscriptionInfoProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <h4 className="font-medium mb-2">Suscripción</h4>
        <div className="flex items-center gap-2">
          <Badge
            variant={subscription.status === "active" ? "default" : "secondary"}
          >
            {subscription.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Plan: {subscription.plan}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CompanyAuditInfoProps {
  company: CompanyData;
}

export function CompanyAuditInfo({ company }: CompanyAuditInfoProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <h4 className="font-medium mb-2">Información de Auditoría</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Creado</p>
              <p className="text-sm">
                {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {company.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Actualizado</p>
                <p className="text-sm">
                  {new Date(company.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
