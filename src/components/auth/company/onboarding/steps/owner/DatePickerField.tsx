"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, parseISOToLocalDate } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  optional?: boolean;
}

export function DatePickerField({
  label,
  value,
  onChange,
  optional = false,
}: DatePickerFieldProps) {
  return (
    <div>
      <Label>
        {label}
        {optional && " (opcional)"}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 justify-start text-left rounded-md border px-3 py-2",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {value
              ? format(parseISOToLocalDate(value) as Date, "dd/MM/yyyy", {
                  locale: es,
                })
              : "Selecciona fecha"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value ? parseISOToLocalDate(value) : undefined}
            onSelect={(date) =>
              onChange(date ? format(date, "yyyy-MM-dd") : "")
            }
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
