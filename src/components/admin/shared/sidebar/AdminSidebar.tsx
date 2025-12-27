"use client";

import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminSidebarFooter } from "./AdminSidebarFooter";

interface AdminSidebarProps {
  organizationName?: string;
  userFirstName?: string;
  userLastName?: string;
  onLogout?: () => void;
}

export function AdminSidebar({
  organizationName,
  userFirstName,
  userLastName,
  onLogout
}: AdminSidebarProps) {
  return (
    <div className="flex flex-col h-full w-64 bg-background border-r">
      <AdminSidebarHeader
        organizationName={organizationName}
        userFirstName={userFirstName}
        userLastName={userLastName}
      />
      <AdminSidebarNav />
      <AdminSidebarFooter onLogout={onLogout} />
    </div>
  );
}