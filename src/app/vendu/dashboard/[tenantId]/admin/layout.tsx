"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/shared/sidebar/components/AdminSidebar";
import { AdminBreadcrumbs } from "@/components/admin/shared/navigation/AdminBreadcrumbs";
import { SidebarToolbarProvider } from "@/components/admin/shared/sidebar/context/SidebarToolbarContext";
import { useCompany } from "@/services/admin/company";
import {
  getAccountProfile,
  AccountProfileData,
} from "@/services/admin/user-settings";
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
  const [userData, setUserData] = useState<AccountProfileData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getAccountProfile();
        if (result.success && result.data) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setUserLoading(false);
      }
    };
    loadUser();
  }, []);

  const userFirstName = userData?.firstName || "";
  const userLastName = userData?.lastName || "";
  const userId = userData?.authId || 0;

  if (isLoading || userLoading) {
    return (
      <SidebarToolbarProvider>
        <SidebarProvider>
          <AdminSidebar
            organizationName="Cargando..."
            userFirstName={userFirstName}
            userLastName={userLastName}
            userId={userId}
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
          userFirstName={userFirstName}
          userLastName={userLastName}
          userId={userId}
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
