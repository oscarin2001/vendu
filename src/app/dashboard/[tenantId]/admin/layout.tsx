"use client";

import { AdminSidebar } from "@/components/admin/shared/sidebar/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Obtener datos reales del usuario y organización
  // Por ahora, datos mock
  const mockUser = {
    firstName: "Oscar",
    lastName: "Flores"
  };

  const mockOrganization = {
    name: "Vendu S.R.L."
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        organizationName={mockOrganization.name}
        userFirstName={mockUser.firstName}
        userLastName={mockUser.lastName}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}