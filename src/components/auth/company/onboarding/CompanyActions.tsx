"use client";

import { Button } from "@/components/ui/Button";

interface CompanyActionsProps {
  onBack: () => void;
  isPending?: boolean;
}

export function CompanyActions({
  onBack,
  isPending = false,
}: CompanyActionsProps) {
  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex-1"
        disabled={isPending}
      >
        Atrás
      </Button>
      <Button type="submit" className="flex-1" disabled={isPending}>
        {isPending ? "Guardando..." : "Siguiente"}
      </Button>
    </div>
  );
}
