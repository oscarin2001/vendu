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
import {
  getSalaryHint,
  getCurrencySymbol,
  getSalaryLimitsForCurrency,
  getCurrencyCode,
} from "@/services/admin/shared/validations";

interface EmploymentInfoSectionProps {
  salary?: number;
  contributionType: "none" | "contributes" | "paid";
  hireDate: Date;
  country?: string;
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
  country,
  errors,
  onChange,
}: EmploymentInfoSectionProps) {
  const salaryHint = getSalaryHint(country || "");
  const currencySymbol = getCurrencySymbol(country || "");
  const currencyCode = getCurrencyCode(country || "");
  const salaryLimits = getSalaryLimitsForCurrency(currencyCode);

  const handleSalaryChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (salaryLimits && numValue > salaryLimits.max) return;
    onChange("salary", numValue || undefined);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Información Laboral</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="salary" className="text-xs">
            Salario ({currencySymbol})
          </Label>
          <Input
            id="salary"
            type="number"
            value={salary || ""}
            onChange={(e) => handleSalaryChange(e.target.value)}
            placeholder="0.00"
            min="0"
            max={salaryLimits?.max}
            step="0.01"
            className={`h-9 ${errors.salary ? "border-red-500" : ""}`}
          />
          {salaryHint && !errors.salary && (
            <p className="text-[10px] text-muted-foreground">{salaryHint}</p>
          )}
          {errors.salary && (
            <p className="text-xs text-red-500">{errors.salary}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Contribución *</Label>
          <Select
            value={contributionType}
            onValueChange={(value) => onChange("contributionType", value)}
          >
            <SelectTrigger
              className={`h-9 ${errors.contributionType ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No contribuye</SelectItem>
              <SelectItem value="contributes">Contribuyente</SelectItem>
              <SelectItem value="paid">Pagado por empresa</SelectItem>
            </SelectContent>
          </Select>
          {errors.contributionType && (
            <p className="text-xs text-red-500">{errors.contributionType}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="hireDate" className="text-xs">
            Fecha Contratación *
          </Label>
          <Input
            id="hireDate"
            type="date"
            value={hireDate ? hireDate.toISOString().split("T")[0] : ""}
            onChange={(e) => onChange("hireDate", new Date(e.target.value))}
            className={`h-9 ${errors.hireDate ? "border-red-500" : ""}`}
          />
          {errors.hireDate && (
            <p className="text-xs text-red-500">{errors.hireDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
