"use client";

import { AdminSidebarAvatar } from "./AdminSidebarAvatar";

interface AdminSidebarHeaderProps {
  organizationName?: string;
  userFirstName?: string;
  userLastName?: string;
}

export function AdminSidebarHeader({
  organizationName = "Mi Organización",
  userFirstName,
  userLastName
}: AdminSidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-6 border-b">
      <AdminSidebarAvatar
        firstName={userFirstName}
        lastName={userLastName}
        className="h-10 w-10"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {userFirstName} {userLastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {organizationName}
        </p>
      </div>
    </div>
  );
}