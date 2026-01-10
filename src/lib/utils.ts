import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse a date in ISO format YYYY-MM-DD into a Date object in local timezone
export function parseISOToLocalDate(iso?: string) {
  if (!iso) return undefined;
  const parts = iso.split("-").map((p) => Number(p));
  if (parts.length !== 3) return undefined;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

// Build phone number groups for formatting
export function buildPhoneGroups(len: number): number[] {
  if (len === 8) return [4, 4];
  if (len === 9) return [3, 3, 3];
  if (len === 10) return [3, 3, 4];
  // Default fallback
  return [len];
}

// Format phone pattern with X's
export function formatPhonePattern(len: number): string {
  const groups = buildPhoneGroups(len);
  return groups.map((g) => "X".repeat(g)).join(" ");
}

// Generate a unique slug from name
export function generateUniqueSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
