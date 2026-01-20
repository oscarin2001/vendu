"use client";

import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OWNER_CONSTANTS } from "./types";

interface GenderSelectFieldProps {
  value: string;
  onChange: (gender: string) => void;
  error?: string;
}

export function GenderSelectField({
  value,
  onChange,
  error,
}: GenderSelectFieldProps) {
  return (
    <div>
      <Label>Género</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left"
          >
            {value || "Selecciona"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {OWNER_CONSTANTS.GENDERS.map((g) => (
            <DropdownMenuItem key={g} onSelect={() => onChange(g)}>
              {g}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
