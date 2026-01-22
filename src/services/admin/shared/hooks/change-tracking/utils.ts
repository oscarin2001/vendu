/**
 * Utility functions for comparing form values
 * Handles different data types: primitives, dates, arrays, objects
 */

/**
 * Normalize a value for comparison
 * Handles empty strings, null, undefined consistently
 */
export function normalizeValue(value: unknown): unknown {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]; // Compare dates by day
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
}

/**
 * Deep compare two values for equality
 */
export function areValuesEqual(a: unknown, b: unknown): boolean {
  const normA = normalizeValue(a);
  const normB = normalizeValue(b);

  // Both null/empty
  if (normA === null && normB === null) return true;

  // One is null
  if (normA === null || normB === null) return false;

  // Arrays
  if (Array.isArray(normA) && Array.isArray(normB)) {
    if (normA.length !== normB.length) return false;
    const sortedA = [...normA].sort();
    const sortedB = [...normB].sort();
    return sortedA.every((val, idx) => areValuesEqual(val, sortedB[idx]));
  }

  // Objects (non-array, non-date)
  if (typeof normA === "object" && typeof normB === "object") {
    const keysA = Object.keys(normA as object);
    const keysB = Object.keys(normB as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      areValuesEqual(
        (normA as Record<string, unknown>)[key],
        (normB as Record<string, unknown>)[key],
      ),
    );
  }

  // Primitives
  return normA === normB;
}

/**
 * Format a value for display in change summary
 */
export function formatValueForDisplay(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "(vacío)";
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("es-ES");
  }
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "(ninguno)";
    return value.join(", ");
  }
  if (typeof value === "number") {
    return value.toLocaleString("es-ES");
  }
  return String(value);
}
