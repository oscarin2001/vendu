import type { FieldChange } from "@/services/admin/shared/hooks/change-tracking";

export interface ChangeReasonDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when user confirms with reason */
  onConfirm: (reason: string) => void;
  /** Title of the dialog */
  title?: string;
  /** Description shown above the changes list */
  description?: string;
  /** List of changes to display */
  changes: FieldChange[];
  /** Whether the confirm action is in progress */
  isLoading?: boolean;
  /** Entity name for display (e.g., "encargado", "proveedor") */
  entityName?: string;
}

export interface ChangeReasonFormState {
  reason: string;
  error: string | null;
}

export const CHANGE_REASON_LIMITS = {
  minLength: 10,
  maxLength: 500,
} as const;
