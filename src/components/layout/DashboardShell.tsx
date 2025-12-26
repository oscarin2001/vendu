import React from "react";
import { Header } from "@/components/shared/Header";

export default function DashboardShell({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">{children}</div>
    </div>
  );
}
