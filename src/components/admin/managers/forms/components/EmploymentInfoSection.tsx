"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmploymentInfoSectionProps {
  salary?: number;
  contributionType: "none" | "contributes" | "paid";
  hireDate: Date;
  errors: {
    salary?: string;
    contributionType?: string;
    hireDate?: string;
  };
  onChange: (field: string, value: any) => void;
}

export function EmploymentInfoSection({
  salary,
  contributionType,
  hireDate,
  errors,
  onChange,
}: EmploymentInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información Laboral</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salario Mensual</Label>
          <Input
            id="salary"
            type="number"
            value={salary || ""}
            onChange={(e) =>
              onChange("salary", parseFloat(e.target.value) || undefined)
            }
            placeholder="0.00"
            min="0"
            step="0.01"
            className={errors.salary ? "border-red-500" : ""}
          />
          {errors.salary && (
            <p className="text-sm text-red-500">{errors.salary}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contributionType">Tipo de Contribución *</Label>
          <Select
            value={contributionType}
            onValueChange={(value) => onChange("contributionType", value)}
          >
            <SelectTrigger
              className={errors.contributionType ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No contribuye</SelectItem>
              <SelectItem value="contributes">Contribuyente</SelectItem>
              <SelectItem value="paid">Pagado por la empresa</SelectItem>
            </SelectContent>
          </Select>
          {errors.contributionType && (
            <p className="text-sm text-red-500">{errors.contributionType}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hireDate">Fecha de Contratación *</Label>
        <Input
          id="hireDate"
          type="date"
          value={hireDate ? hireDate.toISOString().split("T")[0] : ""}
          onChange={(e) => onChange("hireDate", new Date(e.target.value))}
          className={errors.hireDate ? "border-red-500" : ""}
        />
        {errors.hireDate && (
          <p className="text-sm text-red-500">{errors.hireDate}</p>
        )}
      </div>
    </div>
  );
}
