"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUPPLIER_LIMITS, SupplierFormData } from "../types";

interface NotesSectionProps {
  formData: SupplierFormData;
  onChange: (field: keyof SupplierFormData, value: any) => void;
}

export function SupplierNotesSection({
  formData,
  onChange,
}: NotesSectionProps) {
  const handleNotesChange = (value: string) => {
    onChange("notes", value.slice(0, SUPPLIER_LIMITS.notes.max));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notas adicionales</Label>
      <Textarea
        id="notes"
        value={formData.notes || ""}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="Información adicional sobre el proveedor..."
        rows={3}
        maxLength={SUPPLIER_LIMITS.notes.max}
      />
      <p className="text-xs text-muted-foreground text-right">
        {formData.notes?.length || 0}/{SUPPLIER_LIMITS.notes.max}
      </p>
    </div>
  );
}
