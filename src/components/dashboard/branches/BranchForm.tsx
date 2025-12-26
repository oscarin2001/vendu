"use client";
import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function BranchForm({
  values,
  onChange,
  onSubmit,
}: {
  values: any;
  onChange: (v: any) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-3"
    >
      <label className="flex flex-col">
        <span className="text-sm">Nombre</span>
        <Input
          value={values.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </label>
      <label className="flex flex-col">
        <span className="text-sm">Dirección</span>
        <Input
          value={values.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </label>
      <div className="flex justify-end">
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
