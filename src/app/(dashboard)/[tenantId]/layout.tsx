import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";

type Props = { children: React.ReactNode; params: { tenantId: string } };

export default async function TenantLayout({ children, params }: Props) {
  // Aquí se resolvería tenantId -> companyId y tenant metadata (Server Component)
  return <DashboardShell tenantId={params.tenantId}>{children}</DashboardShell>;
}
