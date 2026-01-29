"use client";

import { AlertCircle } from "lucide-react";

interface ManagerLoginErrorProps {
  message: string | null;
}

export function ManagerLoginError({ message }: ManagerLoginErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
