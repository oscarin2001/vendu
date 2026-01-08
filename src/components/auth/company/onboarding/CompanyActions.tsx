"use client";

import { Button } from "@/components/ui/Button";

interface CompanyActionsProps {
  onBack: () => void;
  isPending?: boolean;
  showBackButton?: boolean;
}

export function CompanyActions({
  onBack,
  isPending = false,
  showBackButton = true,
}: CompanyActionsProps) {
  return (
    <div className="flex space-x-4">
      {showBackButton && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isPending}
        >
          Atrás
        </Button>
      )}
      <Button type="submit" className={showBackButton ? "flex-1" : "w-full"} disabled={isPending}>
        {isPending ? "Guardando..." : "Siguiente"}
      </Button>
    </div>
  );
}
