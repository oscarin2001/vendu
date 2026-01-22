"use client";

import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { SupplierFormData } from "../types";

interface ContractSectionProps {
  formData: SupplierFormData;
  onChange: (field: keyof SupplierFormData, value: any) => void;
}

export function SupplierContractSection({
  formData,
  onChange,
}: ContractSectionProps) {
  const handleIndefiniteChange = (checked: boolean) => {
    onChange("isIndefinite", checked);
    if (checked) {
      onChange("contractEndAt", null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Información de Asociación
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partnerSince">Socio desde</Label>
          <DatePicker
            date={formData.partnerSince || undefined}
            onSelect={(date) => onChange("partnerSince", date || null)}
            placeholder="Fecha de inicio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractEndAt">Fin de contrato</Label>
          <DatePicker
            date={formData.contractEndAt || undefined}
            onSelect={(date) => onChange("contractEndAt", date || null)}
            placeholder="Fecha de fin"
            disabled={formData.isIndefinite}
            className={formData.isIndefinite ? "bg-muted" : ""}
          />
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <Checkbox
            id="isIndefinite"
            checked={formData.isIndefinite || false}
            onCheckedChange={handleIndefiniteChange}
          />
          <Label htmlFor="isIndefinite" className="cursor-pointer">
            Contrato por tiempo indefinido
          </Label>
        </div>
      </div>
    </div>
  );
}
