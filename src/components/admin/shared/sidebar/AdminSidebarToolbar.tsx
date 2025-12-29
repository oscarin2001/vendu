"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { useSidebarToolbar } from "./SidebarToolbarContext";

export function AdminSidebarToolbar() {
  const { title, breadcrumbs } = useSidebarToolbar();
  React.useEffect(() => {
    console.log("[AdminSidebarToolbar] render", { title, breadcrumbs });
  }, [title, breadcrumbs]);

  return (
    <header
      data-testid="admin-sidebar-toolbar"
      className="sticky top-0 z-20 bg-background flex items-center gap-3 px-4 py-4 border-b"
      // Temporarily add a visible outline for debugging; remove once confirmed
      style={{ boxShadow: "0 0 0 2px rgba(220,38,38,0.12) inset" }}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <nav className="hidden md:flex items-center text-sm text-muted-foreground">
          {breadcrumbs.map((b, i) => (
            <span
              key={i}
              className={
                i === breadcrumbs.length - 1
                  ? "font-medium text-foreground ml-2"
                  : "opacity-70"
              }
            >
              {i > 0 && <span className="mx-2">/</span>}
              {b}
            </span>
          ))}
        </nav>
      </div>

      <h1 className="ml-4 text-lg font-bold truncate">{title}</h1>
    </header>
  );
}

export default AdminSidebarToolbar;
