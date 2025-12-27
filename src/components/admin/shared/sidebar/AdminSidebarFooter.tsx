"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminSidebarFooterProps {
  onLogout?: () => void;
}

export function AdminSidebarFooter({ onLogout }: AdminSidebarFooterProps) {
  const handleLogout = () => {
    // TODO: Implementar logout real
    // - Limpiar sesión
    // - Redirigir a login
    console.log("Logout clicked");
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: redirigir a login
      window.location.href = "/login";
    }
  };

  return (
    <div className="px-4 py-6 border-t">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
}