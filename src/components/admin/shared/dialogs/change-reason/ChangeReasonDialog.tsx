"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileEdit } from "lucide-react";
import { ChangesSummaryList } from "./ChangesSummaryList";
import type { ChangeReasonDialogProps } from "./types";
import { CHANGE_REASON_LIMITS } from "./types";

/**
 * Dialog that prompts user for a reason before confirming changes
 * Shows a summary of what fields changed and requires a minimum explanation
 */
export function ChangeReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar cambios",
  description,
  changes,
  isLoading = false,
  entityName = "registro",
}: ChangeReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  const handleReasonChange = (value: string) => {
    // Enforce max length
    if (value.length <= CHANGE_REASON_LIMITS.maxLength) {
      setReason(value);
      if (error) setError(null);
    }
  };

  const handleConfirm = () => {
    const trimmed = reason.trim();

    if (trimmed.length < CHANGE_REASON_LIMITS.minLength) {
      setError(
        `El motivo debe tener al menos ${CHANGE_REASON_LIMITS.minLength} caracteres`,
      );
      return;
    }

    onConfirm(trimmed);
  };

  const remainingChars = CHANGE_REASON_LIMITS.maxLength - reason.length;
  const isValid = reason.trim().length >= CHANGE_REASON_LIMITS.minLength;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-amber-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description ||
              `Estás a punto de modificar este ${entityName}. Por favor, indica el motivo del cambio.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Changes summary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cambios a realizar:</Label>
            <ChangesSummaryList changes={changes} />
          </div>

          {/* Reason input */}
          <div className="space-y-2">
            <Label htmlFor="change-reason" className="text-sm font-medium">
              Motivo del cambio <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="change-reason"
              placeholder="Explica brevemente por qué realizas estos cambios..."
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className={error ? "border-destructive" : ""}
              rows={3}
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs">
              {error ? (
                <span className="text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Mínimo {CHANGE_REASON_LIMITS.minLength} caracteres
                </span>
              )}
              <span
                className={
                  remainingChars < 50
                    ? "text-amber-500"
                    : "text-muted-foreground"
                }
              >
                {remainingChars} restantes
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isLoading}>
            {isLoading ? "Guardando..." : "Confirmar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
