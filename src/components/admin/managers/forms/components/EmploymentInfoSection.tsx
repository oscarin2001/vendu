"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  birthDate?: Date;
  joinedAt?: Date;
  contractEndAt?: Date;
  isIndefinite?: boolean;
  country?: string;
  errors: {
    salary?: string;
    contributionType?: string;
    hireDate?: string;
    birthDate?: string;
    joinedAt?: string;
    contractEndAt?: string;
  };
  onChange: (field: string, value: any) => void;
}

export function EmploymentInfoSection({
  salary,
  contributionType,
  hireDate,
  birthDate,
  joinedAt,
  contractEndAt,
  isIndefinite,
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

  const handleIndefiniteChange = (checked: boolean) => {
    onChange("isIndefinite", checked);
    if (checked) {
      onChange("contractEndAt", undefined);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Información Laboral</h3>

      {/* Row 1: Fecha de Nacimiento y Desde Cuando Trabaja */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="birthDate" className="text-xs">
            Fecha de Nacimiento
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate ? birthDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              onChange(
                "birthDate",
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className={`h-9 ${errors.birthDate ? "border-red-500" : ""}`}
          />
          {errors.birthDate && (
            <p className="text-xs text-red-500">{errors.birthDate}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="joinedAt" className="text-xs">
            Desde Cuándo Trabaja
          </Label>
          <Input
            id="joinedAt"
            type="date"
            value={joinedAt ? joinedAt.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              onChange(
                "joinedAt",
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className={`h-9 ${errors.joinedAt ? "border-red-500" : ""}`}
          />
          {errors.joinedAt && (
            <p className="text-xs text-red-500">{errors.joinedAt}</p>
          )}
        </div>
      </div>

      {/* Row 2: Hasta Cuando + Checkbox Indefinido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="contractEndAt" className="text-xs">
            Hasta Cuándo (Fin Contrato)
          </Label>
          <Input
            id="contractEndAt"
            type="date"
            value={contractEndAt ? contractEndAt.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              onChange(
                "contractEndAt",
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            disabled={isIndefinite}
            className={`h-9 ${errors.contractEndAt ? "border-red-500" : ""} ${isIndefinite ? "bg-muted" : ""}`}
          />
          {errors.contractEndAt && (
            <p className="text-xs text-red-500">{errors.contractEndAt}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="isIndefinite"
            checked={isIndefinite}
            onCheckedChange={handleIndefiniteChange}
          />
          <Label
            htmlFor="isIndefinite"
            className="text-xs font-normal cursor-pointer"
          >
            Contrato por tiempo indefinido
          </Label>
        </div>
      </div>

      {/* Row 3: Salary, Contribution Type, Hire Date */}
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
