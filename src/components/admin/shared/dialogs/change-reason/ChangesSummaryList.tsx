import { formatValueForDisplay } from "@/services/admin/shared/hooks/change-tracking";
import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";
import { ArrowRight } from "lucide-react";

interface ChangesSummaryListProps {
  changes: FieldChange[];
  maxVisible?: number;
}

/**
 * Displays a list of field changes with old → new values
 */
export function ChangesSummaryList({
  changes,
  maxVisible = 5,
}: ChangesSummaryListProps) {
  const visibleChanges = changes.slice(0, maxVisible);
  const hiddenCount = changes.length - maxVisible;

  if (changes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No hay cambios detectados
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {visibleChanges.map((change) => (
        <div
          key={change.field}
          className="flex items-center gap-2 text-sm bg-muted/50 rounded-md p-2"
        >
          <span className="font-medium text-foreground min-w-[120px]">
            {change.label}:
          </span>
          <span className="text-muted-foreground line-through">
            {formatValueForDisplay(change.oldValue)}
          </span>
          <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-primary font-medium">
            {formatValueForDisplay(change.newValue)}
          </span>
        </div>
      ))}
      {hiddenCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Y {hiddenCount} campo(s) más...
        </p>
      )}
    </div>
  );
}
