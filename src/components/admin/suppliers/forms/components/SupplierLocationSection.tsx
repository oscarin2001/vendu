"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    const depts = getDepartmentsForCountry(companyCountry || "");
    setDepartments(depts);
    if (formData.department && !depts.includes(formData.department)) {
      onChange("department", "");
    }
  }, [companyCountry]);

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
