"use client";

import { Button } from "@/components/ui/Button";

interface WarehouseActionsProps {
  onBack: () => void;
  onSkip: () => void;
  hasWarehouse: boolean;
  isPending?: boolean;
}

export function WarehouseActions({
  onBack,
  onSkip,
  hasWarehouse,
  isPending = false,
}: WarehouseActionsProps) {
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
      {!hasWarehouse && (
        <Button
          type="button"
          variant="secondary"
          onClick={onSkip}
          className="flex-1"
          disabled={isPending}
        >
          {isPending ? "Omitiendo..." : "Omitir"}
        </Button>
      )}
      {hasWarehouse && (
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Guardando..." : "Siguiente"}
        </Button>
      )}
    </div>
  );
}
