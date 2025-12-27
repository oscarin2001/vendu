"use client";

import { ReactNode } from "react";

interface DashboardShellProps {
  tenantId: string;
  children: ReactNode;
}

export default function DashboardShell({ tenantId, children }: DashboardShellProps) {
  // TODO: Aquí podríamos agregar navegación global del tenant,
  // breadcrumbs, o configuración global
  // Por ahora, solo renderizamos children

  return (
    <div className="min-h-screen bg-background">
      {/* Aquí podría ir header global, navegación lateral, etc. */}
      {children}
    </div>
  );
}