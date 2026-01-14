"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ImmutableConfirmCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  label?: string;
}

/**
 * Checkbox de confirmación para campos inmutables.
 * El usuario debe confirmar que entiende que no podrá cambiar estos datos.
 */
export function ImmutableConfirmCheckbox({
  checked,
  onCheckedChange,
  className,
  label = "Confirmo que el nombre y URL de la empresa son correctos y entiendo que no podré cambiarlos después.",
}: ImmutableConfirmCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer",
        "hover:bg-muted/50 transition-colors",
        checked
          ? "border-primary/50 bg-primary/5"
          : "border-muted-foreground/20",
        className
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <span className="text-sm text-muted-foreground leading-relaxed">
        {label}
      </span>
    </label>
  );
}
