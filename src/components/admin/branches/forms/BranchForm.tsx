"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Lock, Calendar } from "lucide-react";
import { BranchAuditInfo } from "./components";
import { PhoneInput } from "@/components/ui/phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormChanges } from "@/services/admin/shared/hooks/change-tracking";
import {
  getDepartmentsForCountry,
  FIELD_LIMITS,
  filterEntityName,
  filterCityInput,
  filterAddressInput,
  validateBranchName,
  validateCityName,
  validateAddressField,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
} from "@/services/admin/shared/validations";
import { getCountryConfigByName } from "@/services/admin/config/types/countries";
import { BranchFormProps, BranchFormData } from "./types";

export function BranchForm({
  initialData,
  onSubmit,
  onEditRequest,
  isLoading,
  mode,
  branchInfo,
  companyCountry,
  onCancel,
}: BranchFormProps) {
  const defaultCountry = initialData?.country || companyCountry || "";
  const [formData, setFormData] = useState<BranchFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: defaultCountry,
    openedAt: (initialData as any)?.openedAt
      ? new Date((initialData as any).openedAt)
      : null,
  });

  const [errors, setErrors] = useState<Partial<BranchFormData>>({});
  const [departments, setDepartments] = useState<string[]>([]);

  const phoneConfig = getCountryConfigByName(formData.country);
  const phonePrefix = phoneConfig?.phone.prefix ?? "591";
  const phoneLocalLength = phoneConfig?.phone.local ?? 8;

  // Track changes for edit mode
  const { hasChanges, changes } = useFormChanges({
    initialData: initialData || null,
    currentData: formData,
  });

  // Expose for parent
  (BranchForm as any).currentChanges = changes;
  (BranchForm as any).hasChanges = hasChanges;

  useEffect(() => {
    const depts = getDepartmentsForCountry(formData.country);
    setDepartments(depts);
    if (formData.department && !depts.includes(formData.department)) {
      setFormData((prev) => ({ ...prev, department: "" }));
    }
  }, [formData.country]);

  const validateForm = () => {
    const newErrors: Partial<BranchFormData> = {};
    const nameError = validateBranchName(formData.name);
    if (nameError) newErrors.name = nameError;
    const addressError = validateAddressField(formData.address);
    if (addressError) newErrors.address = addressError;
    const cityError = validateCityName(formData.city);
    if (cityError) newErrors.city = cityError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (mode === "edit" && onEditRequest) {
      onEditRequest(formData, changes);
    } else {
      onSubmit(formData);
    }
  };

  const isSubmitDisabled = isLoading || (mode === "edit" && !hasChanges);

  const handleChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNameChange = (value: string) => {
    handleChange("name", filterEntityName(value, FIELD_LIMITS.branchName.max));
  };

  const handleCityChange = (value: string) => {
    handleChange(
      "city",
      filterCityInput(value).slice(0, FIELD_LIMITS.city.max),
    );
  };

  const handleAddressChange = (value: string) => {
    handleChange(
      "address",
      filterAddressInput(value, FIELD_LIMITS.address.max),
    );
  };

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    let localDigits = digits;
    if (phonePrefix && digits.startsWith(phonePrefix)) {
      localDigits = digits.slice(phonePrefix.length);
    }
    if (localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, formData.country);
      if (filtered !== localDigits) {
        const hint = getPhoneStartDigitsHint(formData.country);
        setErrors((prev) => ({
          ...prev,
          phone: hint || "Dígito inicial inválido",
        }));
        const newVal = phonePrefix + filtered;
        handleChange("phone", newVal);
        return;
      }
    }
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
    handleChange("phone", value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Crear Sucursal" : "Editar Sucursal"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === "create" ? "Nueva sucursal" : "Modifica la información"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">
                Nombre *{" "}
                <span className="text-muted-foreground">
                  (máx. {FIELD_LIMITS.branchName.max})
                </span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Sucursal Centro"
                maxLength={FIELD_LIMITS.branchName.max}
                className={`h-9 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Teléfono</Label>
              <PhoneInput
                value={formData.phone}
                onChange={(val) => handlePhoneChange(val)}
                fixedCountryCode={phonePrefix}
                fixedLocalMax={phoneLocalLength}
                hideCountrySelect
                showValidation
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="text-xs">
              Dirección *{" "}
              <span className="text-muted-foreground">
                (máx. {FIELD_LIMITS.address.max})
              </span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Ej: Av. Principal #123"
              maxLength={FIELD_LIMITS.address.max}
              className={`h-9 ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="city" className="text-xs">
                Ciudad *{" "}
                <span className="text-muted-foreground">(solo letras)</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Ej: La Paz"
                maxLength={FIELD_LIMITS.city.max}
                className={`h-9 ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Departamento</Label>
              {departments.length > 0 ? (
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleChange("department", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecciona" />
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
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Departamento"
                  className="h-9"
                />
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                País
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input
                value={formData.country}
                disabled
                className="h-9 bg-muted cursor-not-allowed"
              />
            </div>
          </div>

          {/* Fecha de apertura */}
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Fecha de Apertura
            </Label>
            <DatePicker
              date={formData.openedAt || undefined}
              onSelect={(date: Date | undefined) =>
                setFormData((prev) => ({ ...prev, openedAt: date || null }))
              }
              placeholder="¿Cuándo abrió esta sucursal?"
            />
            <p className="text-[10px] text-muted-foreground">
              Desde cuándo opera esta sucursal
            </p>
          </div>
        </CardContent>
      </Card>

      {branchInfo && <BranchAuditInfo branchInfo={branchInfo} />}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={() => (onCancel?.())}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitDisabled} size="sm">
          {isLoading
            ? "Guardando..."
            : mode === "create"
              ? "Crear"
              : hasChanges
                ? "Guardar cambios"
                : "Sin cambios"}
        </Button>
      </div>
    </form>
  );
}

BranchForm.getChanges = () => (BranchForm as any).currentChanges || [];
BranchForm.getHasChanges = () => (BranchForm as any).hasChanges || false;
