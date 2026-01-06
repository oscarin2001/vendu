"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CompanyData, SubscriptionData } from "@/services/admin/company";
import {
  CompanyOverviewHeader,
  CompanyBasicInfo,
  CompanySubscriptionInfo,
  CompanyAuditInfo,
} from "./components";

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

  return (
    <Card>
      <CompanyOverviewHeader onViewDetails={onViewDetails} onEdit={onEdit} />
      <CardContent className="space-y-6">
        <CompanyBasicInfo company={company} />

        {subscription && (
          <CompanySubscriptionInfo subscription={subscription} />
        )}

        <CompanyAuditInfo company={company} />
      </CardContent>
    </Card>
  );
}
