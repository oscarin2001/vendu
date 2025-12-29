"use client";

import { LogOut, Settings, User } from "lucide-react";
import { AdminSidebarAvatar } from "./AdminSidebarAvatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface AdminSidebarFooterProps {
  userFirstName?: string;
  userLastName?: string;
  onLogout?: () => void;
}

export function AdminSidebarFooter({
  userFirstName,
  userLastName,
  onLogout,
}: AdminSidebarFooterProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="px-3 py-4 border-t">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm hover:bg-muted group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              suppressHydrationWarning
            >
              <AdminSidebarAvatar
                firstName={userFirstName}
                lastName={userLastName}
                className="h-8 w-8"
              />
              <div className="flex-1 min-w-0 text-left hidden md:block group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">
                  {userFirstName} {userLastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">Cuenta</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <div className="flex items-center gap-2">
                  <User className="size-4" /> Perfil
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <div className="flex items-center gap-2">
                  <Settings className="size-4" /> Ajustes
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <div className="flex items-center gap-2">
                <LogOut className="size-4" /> Cerrar sesión
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
