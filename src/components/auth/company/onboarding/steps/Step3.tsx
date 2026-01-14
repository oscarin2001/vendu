"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, parseISOToLocalDate } from "@/lib/utils";
import { COMMERCE_TYPES } from "@/services/auth/company-registration/onboarding/constants";

interface Step3Props {
  data: { commerceType: string; openedAt: string };
  setData: (data: any) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step3({ data, setData, onSubmit, onBack }: Step3Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.commerceType) {
      alert("Selecciona el tipo de comercio.");
      return;
    }
    if (!data.openedAt) {
      alert("Selecciona la fecha de apertura.");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Detalles del Comercio</h2>
        <p className="text-muted-foreground">Completa la información final de tu empresa.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="commerceType">Tipo de comercio</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-left"
              >
                {data.commerceType || "Selecciona el tipo"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {COMMERCE_TYPES.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={() => setData({ ...data, commerceType: option })}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Label htmlFor="openedAt">Fecha de apertura física</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 justify-start text-left font-normal rounded-md border px-3 py-2",
                  !data.openedAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {data.openedAt
                  ? format(
                      parseISOToLocalDate(data.openedAt) as Date,
                      "dd/MM/yyyy",
                      { locale: es }
                    )
                  : "Selecciona la fecha"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={
                  data.openedAt
                    ? parseISOToLocalDate(data.openedAt)
                    : new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        18
                      )
                }
                onSelect={(date) =>
                  setData({ ...data, openedAt: date ? format(date, "yyyy-MM-dd") : "" })
                }
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit">Completar Registro</Button>
      </div>
    </form>
  );
}