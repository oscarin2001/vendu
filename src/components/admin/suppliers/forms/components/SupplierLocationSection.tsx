"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDepartmentsForCountry,
  filterCityInput,
} from "@/services/admin/shared/validations";
import { SUPPLIER_LIMITS, SupplierFormData } from "../types";
import { CountrySelect } from "@/components/ui/country-select";

interface LocationSectionProps {
  formData: SupplierFormData;
  errors: Record<string, string>;
  companyCountry?: string;
  onChange: (field: keyof SupplierFormData, value: any) => void;
}

export function SupplierLocationSection({
  formData,
  errors,
  companyCountry,
  onChange,
}: LocationSectionProps) {
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // Prefer the supplier country when present, otherwise fall back to company country
    const selectedCountry = formData.country || companyCountry || "";
    const depts = getDepartmentsForCountry(selectedCountry);
    setDepartments(depts);
    if (formData.department && !depts.includes(formData.department)) {
      onChange("department", "");
    }
  }, [companyCountry, formData.country]);

  const handleCityChange = (value: string) => {
    const filtered = filterCityInput(value);
    onChange("city", filtered.slice(0, SUPPLIER_LIMITS.city.max));
  };

  const handleAddressChange = (value: string) => {
    onChange("address", value.slice(0, SUPPLIER_LIMITS.address.max));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Checkbox
            id="isForeign"
            checked={Boolean(formData.isForeign)}
            onCheckedChange={(v) => onChange("isForeign", Boolean(v))}
          />
          <span>Proveedor de otro país</span>
        </Label>

        {formData.isForeign ? (
          <div className="space-y-2">
            <Label htmlFor="country">País (manual)</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => onChange("country", e.target.value.slice(0, 80))}
              placeholder="Ej: México"
              maxLength={80}
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="country">País</Label>
            <CountrySelect
              value={formData.country}
              onChange={(val) => onChange("country", val)}
            />
            {formData.country &&
              companyCountry &&
              formData.country !== companyCountry && (
                <p className="text-xs text-yellow-600 mt-2">
                  Atención: este proveedor está configurado en otro país que la
                  compañía. Esto puede afectar impuestos y logística.
                </p>
              )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={formData.city || ""}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="Ciudad"
            className={errors.city ? "border-red-500" : ""}
            maxLength={SUPPLIER_LIMITS.city.max}
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Departamento/Estado</Label>
          {!formData.isForeign &&
          (formData.country || companyCountry) === "Bolivia" ? (
            <Select
              value={formData.department || ""}
              onValueChange={(value) => onChange("department", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="department"
              value={formData.department || ""}
              onChange={(e) =>
                onChange("department", e.target.value.slice(0, 80))
              }
              placeholder="Departamento / Estado"
              maxLength={80}
            />
          )}
          {errors.department && (
            <p className="text-xs text-red-500">{errors.department}</p>
          )}
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Textarea
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Dirección completa"
            rows={2}
            maxLength={SUPPLIER_LIMITS.address.max}
          />
          <p className="text-xs text-muted-foreground text-right">
            {formData.address?.length || 0}/{SUPPLIER_LIMITS.address.max}
          </p>
        </div>
      </div>
    </div>
  );
}
