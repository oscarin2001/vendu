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
