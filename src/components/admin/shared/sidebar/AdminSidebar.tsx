"use client";

import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminSidebarFooter } from "./AdminSidebarFooter";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <AdminSidebarHeader
            organizationName={organizationName}
            userFirstName={userFirstName}
            userLastName={userLastName}
          />
          <AdminSidebarNav />
          <AdminSidebarFooter onLogout={onLogout} />
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  );
}