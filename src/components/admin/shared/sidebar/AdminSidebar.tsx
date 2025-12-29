"use client";

import * as React from "react";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminSidebarFooter } from "./AdminSidebarFooter";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  organizationName?: string;
  userFirstName?: string;
  userLastName?: string;
  tenantId?: string;
  onLogout?: () => void;
}

export function AdminSidebar({
  organizationName,
  userFirstName,
  userLastName,
  tenantId,
  onLogout,
}: AdminSidebarProps) {
  return (
    <Sidebar side="left" variant="inset" collapsible="icon">
      <SidebarContent>
        <AdminSidebarHeader organizationName={organizationName} />
        <AdminSidebarNav tenantId={tenantId} />
        <AdminSidebarFooter
          userFirstName={userFirstName}
          userLastName={userLastName}
          onLogout={onLogout}
        />
      </SidebarContent>
      {/* trigger moved to footer to keep a single visible control below the avatar */}
    </Sidebar>
  );
}
