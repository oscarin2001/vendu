"use client";

import Link from "next/link";

interface AdminSidebarHeaderProps {
  organizationName?: string;
}

export function AdminSidebarHeader({
  organizationName = "Mi Organización",
}: AdminSidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b">
      <Link
        href="/admin"
        className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      >
        {/* If you have a Logo component, it will render here; otherwise show initials via CSS */}
        <div className="h-8 w-8 rounded-md bg-emerald-600 flex items-center justify-center text-white font-semibold">
          {organizationName.charAt(0) || "V"}
        </div>
        <span className="hidden md:inline text-sm font-bold truncate group-data-[collapsible=icon]:hidden">
          {organizationName}
        </span>
      </Link>
      <div className="ml-auto" />
    </div>
  );
}
