/**
 * Types for form change tracking system
 * Used across all edit modals to detect and display changes
 */

export interface FieldChange {
  field: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ChangeTrackingResult<T> {
  /** Whether any field has changed from initial values */
  hasChanges: boolean;
  /** List of fields that have changed */
  changedFields: string[];
  /** Detailed list of changes with old/new values */
  changes: FieldChange[];
  /** Get human-readable summary of changes */
  getChangeSummary: () => string;
  /** Check if a specific field has changed */
  isFieldChanged: (field: keyof T) => boolean;
  /** Get the changed data only (fields that differ from initial) */
  getChangedData: () => Partial<T>;
}

export interface FieldLabelMap {
  [key: string]: string;
}

export interface UseFormChangesOptions<T> {
  /** Initial data to compare against */
  initialData: T | null | undefined;
  /** Current form data */
  currentData: T;
  /** Map of field keys to human-readable labels */
  fieldLabels?: FieldLabelMap;
  /** Fields to ignore when comparing (e.g., confirmPassword) */
  ignoreFields?: (keyof T)[];
}
