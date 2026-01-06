"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock } from "lucide-react";

interface PasswordConfirmationProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onEnterPress: () => void;
}

export function PasswordConfirmation({
  value,
  onChange,
  error,
  onEnterPress,
}: PasswordConfirmationProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Contraseña de confirmación
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Ingresa tu contraseña"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnterPress();
          }
        }}
      />
      {error && (
        <span className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </span>
      )}
    </div>
  );
}
