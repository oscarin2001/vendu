"use client";

import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface ManagerLoginButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export function ManagerLoginButton({ 
  isLoading, 
  disabled = false 
}: ManagerLoginButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Iniciando sesión...
        </span>
      ) : (
        "Iniciar Sesión"
      )}
    </Button>
  );
}
