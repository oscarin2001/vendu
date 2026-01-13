"use client";

import * as React from "react";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "../AdminSidebarNav";
import { AdminSidebarFooter } from "./AdminSidebarFooter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  organizationName?: string;
  userFirstName?: string;
  userLastName?: string;
  userId?: number;
  tenantId?: string;
  onLogout?: () => void;
}

export function AdminSidebar({
  organizationName,
  userFirstName,
  userLastName,
  userId,
  tenantId,
  onLogout,
}: AdminSidebarProps) {
  return (
    <Sidebar side="left" variant="inset" collapsible="icon">
      <SidebarContent>
        <AdminSidebarHeader organizationName={organizationName} />
        <AdminSidebarNav tenantId={tenantId} />
      </SidebarContent>
      <SidebarFooter className="p-0 gap-0">
        <AdminSidebarFooter
          userFirstName={userFirstName}
          userLastName={userLastName}
          userId={userId}
          onLogout={onLogout}
        />
      </SidebarFooter>
      {/* trigger moved to footer to keep a single visible control below the avatar */}
    </Sidebar>
  );
}
