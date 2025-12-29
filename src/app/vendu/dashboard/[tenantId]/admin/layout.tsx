"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/shared/sidebar/AdminSidebar";
import { AdminBreadcrumbs } from "@/components/admin/shared/navigation/AdminBreadcrumbs";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface CompanyData {
  name: string;
  // Add other fields as needed
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/company/${tenantId}`);
        if (response.ok) {
          const data = await response.json();
          setCompanyData(data);
        } else {
          // Fallback to default name if API fails
          setCompanyData({ name: "Empresa" });
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompanyData({ name: "Empresa" });
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId) {
      fetchCompanyData();
    }
  }, [tenantId]);

  // TODO: Obtener datos reales del usuario
  // Por ahora, datos mock
  const mockUser = {
    firstName: "Oscar",
    lastName: "Flores",
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AdminSidebar
          organizationName="Cargando..."
          userFirstName={mockUser.firstName}
          userLastName={mockUser.lastName}
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
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        organizationName={companyData?.name || "Empresa"}
        userFirstName={mockUser.firstName}
        userLastName={mockUser.lastName}
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
  );
}
