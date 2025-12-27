"use client";

import { AdminSidebar } from "@/components/admin/shared/sidebar/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Obtener datos reales del usuario y organización
  // Por ahora, datos mock
  const mockUser = {
    firstName: "Oscar",
    lastName: "Flores",
  };

  const mockOrganization = {
    name: "Vendu S.R.L.",
  };

  return (
    <SidebarProvider>
      <AdminSidebar
        organizationName={mockOrganization.name}
        userFirstName={mockUser.firstName}
        userLastName={mockUser.lastName}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
