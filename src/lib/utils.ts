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

export function buildPhoneGroups(len: number) {
  const groups: number[] = [];
  if (len === 8) groups.push(4, 4);
  else if (len === 9) groups.push(3, 3, 3);
  else if (len === 10) groups.push(3, 3, 4);
  else if (len === 7) groups.push(3, 4);
  else {
    let remaining = len;
    while (remaining > 0) {
      if (remaining > 4) {
        groups.push(3);
        remaining -= 3;
      } else {
        groups.push(remaining);
        remaining = 0;
      }
    }
  }
  return groups;
}

export function formatPhonePattern(len: number) {
  return buildPhoneGroups(len).map((g) => "X".repeat(g)).join(" ");
}
