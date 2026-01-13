"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/shared/sidebar/components/AdminSidebar";
import { AdminBreadcrumbs } from "@/components/admin/shared/navigation/AdminBreadcrumbs";
import { SidebarToolbarProvider } from "@/components/admin/shared/sidebar/context/SidebarToolbarContext";
import { useCompany } from "@/services/admin/company";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const { company, isLoading } = useCompany(tenantId);

  // TODO: Obtener datos reales del usuario
  // Por ahora, datos mock
  const mockUser = {
    id: 1,
    firstName: "Oscar",
    lastName: "Flores",
  };

  if (isLoading) {
    return (
      <SidebarToolbarProvider>
        <SidebarProvider>
          <AdminSidebar
            organizationName="Cargando..."
            userFirstName={mockUser.firstName}
            userLastName={mockUser.lastName}
            userId={mockUser.id}
            tenantId={tenantId}
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <AdminBreadcrumbs />
            </header>
            <div className="p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </SidebarToolbarProvider>
    );
  }

  return (
    <SidebarToolbarProvider>
      <SidebarProvider>
        <AdminSidebar
          organizationName={company?.name || "Empresa"}
          userFirstName={mockUser.firstName}
          userLastName={mockUser.lastName}
          userId={mockUser.id}
          tenantId={tenantId}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <AdminBreadcrumbs />
          </header>
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarToolbarProvider>
  );
}
