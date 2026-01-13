"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface CompanyDepartmentFieldProps {
  value: string;
  options: string[];
  onSelect: (department: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CompanyDepartmentField({
  value,
  options,
  onSelect,
  disabled = false,
  error,
}: CompanyDepartmentFieldProps) {
  return (
    <Field>
      <FieldLabel>Departamento</FieldLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between h-12 px-4"
            disabled={disabled || options.length === 0}
          >
            <span className="font-medium">
              {value ||
                (options.length
                  ? "Selecciona un departamento"
                  : "Sin departamentos")}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-72 overflow-y-auto w-64">
          {options.map((department) => (
            <DropdownMenuItem
              key={department}
              onSelect={() => onSelect(department)}
            >
              {department}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </Field>
  );
}
