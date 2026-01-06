"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Type } from "lucide-react";

interface BranchNameConfirmationProps {
  branchName: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onEnterPress: () => void;
}

export function BranchNameConfirmation({
  branchName,
  value,
  onChange,
  error,
  onEnterPress,
}: BranchNameConfirmationProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="branchName" className="flex items-center gap-2">
        <Type className="h-4 w-4" />
        Escribe el nombre completo de la sucursal
      </Label>
      <Input
        id="branchName"
        placeholder={`Escribe: ${branchName}`}
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
      <span className="text-xs text-muted-foreground block">
        Debes escribir exactamente: <strong>{branchName}</strong>
      </span>
    </div>
  );
}
