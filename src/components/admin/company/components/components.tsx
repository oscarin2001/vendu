import { CompanyData, SubscriptionData } from "@/services/admin/company";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function CompanyBasicCard({ company }: CompanyBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{company.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">País</p>
            <p className="font-medium">{company.country}</p>
          </div>
          {company.department && (
            <div>
              <p className="text-sm text-muted-foreground">Departamento</p>
              <p className="font-medium">{company.department}</p>
            </div>
          )}
          {company.commerceType && (
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Comercio</p>
              <p className="font-medium">{company.commerceType}</p>
            </div>
          )}
          {company.openedAt && (
            <div>
              <p className="text-sm text-muted-foreground">
                Fecha de Fundación
              </p>
              <p className="font-medium">
                {new Date(company.openedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyFiscalCard({ company }: CompanyBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">NIT / ID Fiscal</p>
            <p className="font-medium">{company.taxId || "No especificado"}</p>
          </div>
          {company.businessName && (
            <div>
              <p className="text-sm text-muted-foreground">Razón social</p>
              <p className="font-medium">{company.businessName}</p>
            </div>
          )}
          {company.fiscalAddress && (
            <div>
              <p className="text-sm text-muted-foreground">Dirección fiscal</p>
              <p className="font-medium">{company.fiscalAddress}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Ruta del NIT</p>
            <p className="font-medium">
              {company.taxIdPath || "No especificado"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyDescriptionCard({ company }: CompanyBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Descripción y Objetivos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Descripción</h4>
          <p className="text-sm text-muted-foreground">
            {company.description || "No especificado"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Visión</h4>
            <p className="text-sm text-muted-foreground">
              {company.vision || "No especificado"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Misión</h4>
            <p className="text-sm text-muted-foreground">
              {company.mission || "No especificado"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyOwnerCard({ company }: CompanyBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Fundador / Responsable
        </CardTitle>
      </CardHeader>
      <CardContent>
        {company.owner ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">
                {company.owner.firstName} {company.owner.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">
                {company.owner.phone || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CI / ID</p>
              <p className="font-medium">
                {company.owner.ci || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Fecha de nacimiento
              </p>
              <p className="font-medium">
                {company.owner.birthDate
                  ? new Date(company.owner.birthDate).toLocaleDateString()
                  : company.owner.birthYear || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Se unió</p>
              <p className="font-medium">
                {company.owner.joinedAt
                  ? new Date(company.owner.joinedAt).toLocaleDateString()
                  : "No especificado"}
              </p>
            </div>
            {/* Contrato fin removido del onboarding; se oculta en la tarjeta */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No asignado</p>
        )}
      </CardContent>
    </Card>
  );
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
          {company.department && (
            <div>
              <p className="text-sm text-muted-foreground">Departamento</p>
              <p className="font-medium">{company.department}</p>
            </div>
          )}
          {company.commerceType && (
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Comercio</p>
              <p className="font-medium">{company.commerceType}</p>
            </div>
          )}
          {company.openedAt && (
            <div>
              <p className="text-sm text-muted-foreground">
                Fecha de Fundación
              </p>
              <p className="font-medium">
                {new Date(company.openedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Descripción</h4>
        <p className="text-sm text-muted-foreground">
          {company.description || "No especificado"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Visión</h4>
          <p className="text-sm text-muted-foreground">
            {company.vision || "No especificado"}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Misión</h4>
          <p className="text-sm text-muted-foreground">
            {company.mission || "No especificado"}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <User className="h-4 w-4" />
          Información del Propietario
        </h4>
        {company.owner ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">
                {company.owner.firstName} {company.owner.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">
                {company.owner.phone || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CI / ID</p>
              <p className="font-medium">
                {company.owner.ci || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Fecha de nacimiento
              </p>
              <p className="font-medium">
                {company.owner.birthDate
                  ? new Date(company.owner.birthDate).toLocaleDateString()
                  : company.owner.birthYear || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Se unió</p>
              <p className="font-medium">
                {company.owner.joinedAt
                  ? new Date(company.owner.joinedAt).toLocaleDateString()
                  : "No especificado"}
              </p>
            </div>
            {/* Contrato fin removido del onboarding; se oculta en la tarjeta */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No asignado</p>
        )}
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
