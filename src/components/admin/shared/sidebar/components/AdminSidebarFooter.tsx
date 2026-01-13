"use client";

import { useCallback, useEffect, useState } from "react";
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
import { UserSettingsModal } from "@/components/admin/user-settings";
import { useLogout } from "@/hooks/use-logout";

interface AdminSidebarFooterProps {
  userFirstName?: string;
  userLastName?: string;
  userId?: number;
  onLogout?: () => void;
}

export function AdminSidebarFooter({
  userFirstName,
  userLastName,
  userId,
  onLogout,
}: AdminSidebarFooterProps) {
  const [mounted, setMounted] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { logout, isPending } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout?.();
    if (!isPending) {
      logout();
    }
  }, [logout, onLogout, isPending]);

  return (
    <div className="px-2 pt-1 pb-0 border-t">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md px-2 py-1 text-sm hover:bg-muted group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
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
          {mounted && (
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="size-4 mr-2" /> Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="size-4 mr-2" /> Ajustes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  handleLogout();
                }}
                disabled={isPending}
                className="text-destructive"
              >
                <LogOut className="size-4 mr-2" />
                {isPending ? "Cerrando..." : "Cerrar sesión"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      {userId && (
        <UserSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
