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
import { Textarea } from "@/components/ui/textarea";
import { Truck, Lock, Calendar, Handshake } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  getDepartmentsForCountry,
  filterNameInput,
  filterCityInput,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
} from "@/services/admin/shared/validations";
import { getCountryConfigByName } from "@/services/admin/config/types/countries";

// Character limits specific to supplier form
const SUPPLIER_LIMITS = {
  firstName: { min: 2, max: 30 },
  lastName: { min: 2, max: 30 },
  email: { max: 80 },
  address: { min: 5, max: 300 },
  city: { min: 2, max: 40 },
  notes: { max: 500 },
};

interface SupplierFormData {
  firstName: string;
  lastName: string;
  ci?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  notes?: string;
  birthDate?: Date | null; // Fecha de nacimiento del proveedor
  partnerSince?: Date | null; // Desde cuándo trabaja con la empresa
  contractEndAt?: Date | null; // Fin de contrato
  isIndefinite?: boolean; // Contrato por tiempo indefinido
}

interface SupplierAuditInfo {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
}

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  supplierInfo?: SupplierAuditInfo;
  companyCountry?: string;
}

export function SupplierForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
  supplierInfo,
  companyCountry,
}: SupplierFormProps) {
  // Country is fixed from company selection in onboarding
  const fixedCountry = companyCountry || initialData?.country;

  // Get phone config for the fixed country
  const countryConfig = getCountryConfigByName(fixedCountry);
  const phonePrefix = countryConfig?.phone.prefix ?? "591";
  const phoneLocalLength = countryConfig?.phone.local ?? 8;

  const [formData, setFormData] = useState<SupplierFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    ci: (initialData as any)?.ci || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: fixedCountry,
    notes: initialData?.notes || "",
    birthDate: (initialData as any)?.birthDate
      ? new Date((initialData as any).birthDate)
      : null,
    partnerSince: (initialData as any)?.partnerSince
      ? new Date((initialData as any).partnerSince)
      : null,
    contractEndAt: (initialData as any)?.contractEndAt
      ? new Date((initialData as any).contractEndAt)
      : null,
    isIndefinite: (initialData as any)?.isIndefinite || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<string[]>([]);

  // Update departments when country changes
  useEffect(() => {
    const depts = getDepartmentsForCountry(fixedCountry || "");
    setDepartments(depts);
    if (formData.department && !depts.includes(formData.department)) {
      setFormData((prev) => ({ ...prev, department: "" }));
    }
  }, [fixedCountry]);

  const handleChange = (field: keyof SupplierFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCiChange = (value: string) => {
    // Simple filter: allow alphanumeric and hyphens
    const filtered = value.replace(/[^0-9A-Za-z-]/g, "");
    handleChange("ci", filtered.slice(0, 20));
  };

  // Name filter - only allow letters with max length
  const handleNameChange = (field: "firstName" | "lastName", value: string) => {
    const filtered = filterNameInput(value);
    const maxLength = SUPPLIER_LIMITS[field].max;
    handleChange(field, filtered.slice(0, maxLength));
  };

  // City filter - only letters, no numbers
  const handleCityChange = (value: string) => {
    const filtered = filterCityInput(value);
    handleChange("city", filtered.slice(0, SUPPLIER_LIMITS.city.max));
  };

  // Email with max length
  const handleEmailChange = (value: string) => {
    handleChange("email", value.slice(0, SUPPLIER_LIMITS.email.max));
  };

  // Address with max length
  const handleAddressChange = (value: string) => {
    handleChange("address", value.slice(0, SUPPLIER_LIMITS.address.max));
  };

  // Notes with max length
  const handleNotesChange = (value: string) => {
    handleChange("notes", value.slice(0, SUPPLIER_LIMITS.notes.max));
  };

  // Phone change handler for PhoneInput con filtro de primer dígito
  const handlePhoneChange = (value: string) => {
    // Extraer dígitos locales
    let digits = value.replace(/\D/g, "");
    let localDigits = digits;
    if (phonePrefix && digits.startsWith(phonePrefix)) {
      localDigits = digits.slice(phonePrefix.length);
    }

    // Filtrar primer dígito si no es válido para el país
    if (localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, fixedCountry || "");
      if (filtered !== localDigits) {
        // El primer dígito no es válido, mostrar error
        const hint = getPhoneStartDigitsHint(fixedCountry || "");
        setErrors((prev) => ({
          ...prev,
          phone: hint || "Dígito inicial inválido",
        }));
        const newVal = phonePrefix + filtered;
        handleChange("phone", newVal);
        return;
      }
    }

    // Limpiar error si existe
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
    handleChange("phone", value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.length < SUPPLIER_LIMITS.firstName.min) {
      newErrors.firstName = `Mínimo ${SUPPLIER_LIMITS.firstName.min} caracteres`;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (formData.lastName.length < SUPPLIER_LIMITS.lastName.min) {
      newErrors.lastName = `Mínimo ${SUPPLIER_LIMITS.lastName.min} caracteres`;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validate phone length
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const localDigits = phoneDigits.startsWith(phonePrefix)
        ? phoneDigits.slice(phonePrefix.length)
        : phoneDigits;

      if (localDigits.length > 0 && localDigits.length !== phoneLocalLength) {
        newErrors.phone = `El teléfono debe tener ${phoneLocalLength} dígitos`;
      }
    }

    // Validate city - no numbers
    if (formData.city && /\d/.test(formData.city)) {
      newErrors.city = "La ciudad no puede contener números";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert empty strings to undefined for optional fields
    const submitData = {
      ...formData,
      email: formData.email?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      city: formData.city?.trim() || undefined,
      department: formData.department?.trim() || undefined,
      country: fixedCountry,
      notes: formData.notes?.trim() || undefined,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-green-100 rounded-lg">
          <Truck className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">
            {mode === "create" ? "Nuevo Proveedor" : "Editar Proveedor"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === "create"
              ? "Agrega un nuevo proveedor"
              : "Modifica la información"}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="py-2">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-xs font-medium">
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs">
                Nombre *{" "}
                <span className="text-muted-foreground">
                  ({formData.firstName.length}/{SUPPLIER_LIMITS.firstName.max})
                </span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleNameChange("firstName", e.target.value)}
                placeholder="Máx 30 caracteres"
                maxLength={SUPPLIER_LIMITS.firstName.max}
                className={`h-9 ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs">
                Apellido *{" "}
                <span className="text-muted-foreground">
                  ({formData.lastName.length}/{SUPPLIER_LIMITS.lastName.max})
                </span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleNameChange("lastName", e.target.value)}
                placeholder="Máx 30 caracteres"
                maxLength={SUPPLIER_LIMITS.lastName.max}
                className={`h-9 ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">
                Teléfono
              </Label>
              <PhoneInput
                value={formData.phone || ""}
                onChange={handlePhoneChange}
                fixedCountryCode={phonePrefix}
                fixedLocalMax={phoneLocalLength}
                hideCountrySelect
                showValidation
                placeholder={`${phoneLocalLength} dígitos`}
                className={`h-9 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">
                Email{" "}
                <span className="text-muted-foreground">
                  ({formData.email?.length || 0}/{SUPPLIER_LIMITS.email.max})
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="proveedor@ejemplo.com"
                maxLength={SUPPLIER_LIMITS.email.max}
                className={`h-9 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="py-2">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-xs font-medium">Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-3">
          <div className="space-y-1">
            <Label htmlFor="address" className="text-xs">
              Dirección{" "}
              <span className="text-muted-foreground">
                ({formData.address?.length || 0}/{SUPPLIER_LIMITS.address.max})
              </span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Dirección completa (máx 300 caracteres)"
              maxLength={SUPPLIER_LIMITS.address.max}
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="city" className="text-xs">
                Ciudad{" "}
                <span className="text-muted-foreground">(solo letras)</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Ej: La Paz"
                maxLength={SUPPLIER_LIMITS.city.max}
                className={`h-9 ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="department" className="text-xs">
                Departamento
              </Label>
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
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Ej: La Paz"
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
                value={fixedCountry}
                disabled
                className="h-9 bg-muted cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="py-2">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-xs font-medium">
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-3">
          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Fecha de Nacimiento
              </Label>
              <DatePicker
                date={formData.birthDate || undefined}
                onSelect={(date: Date | undefined) =>
                  setFormData((prev) => ({ ...prev, birthDate: date || null }))
                }
                placeholder="Fecha de nacimiento"
                fromYear={1940}
                toYear={new Date().getFullYear() - 18}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <Handshake className="h-3 w-3" />
                Proveedor Desde
              </Label>
              <DatePicker
                date={formData.partnerSince || undefined}
                onSelect={(date: Date | undefined) =>
                  setFormData((prev) => ({
                    ...prev,
                    partnerSince: date || null,
                  }))
                }
                placeholder="¿Desde cuándo trabajan juntos?"
              />
              <p className="text-[10px] text-muted-foreground">
                Fecha de inicio de relación comercial
              </p>
            </div>

              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Fin de Contrato
                </Label>
                <DatePicker
                  date={formData.contractEndAt || undefined}
                  onSelect={(date: Date | undefined) =>
                    setFormData((prev) => ({
                      ...prev,
                      contractEndAt: date || null,
                    }))
                  }
                  placeholder="Fecha fin de contrato"
                  disabled={formData.isIndefinite}
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isIndefinite"
                    checked={!!formData.isIndefinite}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isIndefinite: e.target.checked,
                        contractEndAt: e.target.checked ? null : prev.contractEndAt,
                      }))
                    }
                  />
                  <label htmlFor="isIndefinite" className="text-xs">
                    Contrato por tiempo indefinido
                  </label>
                </div>
              </div>
          </div>

          {/* CI field */}
          <div className="space-y-1 mt-2">
            <Label className="text-xs">Cédula de Identidad (CI)</Label>
            <Input
              value={formData.ci || ""}
              onChange={(e) => handleCiChange(e.target.value)}
              placeholder="Cédula de identidad"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs">
              Notas{" "}
              <span className="text-muted-foreground">
                ({formData.notes?.length || 0}/{SUPPLIER_LIMITS.notes.max})
              </span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Notas adicionales sobre el proveedor..."
              maxLength={SUPPLIER_LIMITS.notes.max}
              className="min-h-[60px] text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      {mode === "edit" && supplierInfo && (
        <Card className="py-2">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-xs font-medium">
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">ID:</span>{" "}
                <span className="font-medium">{supplierInfo.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Creado:</span>{" "}
                <span className="font-medium">
                  {new Date(supplierInfo.createdAt).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
              {supplierInfo.createdBy && (
                <div>
                  <span className="text-muted-foreground">Creado por:</span>{" "}
                  <span className="font-medium">
                    {supplierInfo.createdBy.name}
                  </span>
                </div>
              )}
              {supplierInfo.updatedAt && (
                <div>
                  <span className="text-muted-foreground">Modificado:</span>{" "}
                  <span className="font-medium">
                    {new Date(supplierInfo.updatedAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}
              {supplierInfo.updatedBy && (
                <div>
                  <span className="text-muted-foreground">Modificado por:</span>{" "}
                  <span className="font-medium">
                    {supplierInfo.updatedBy.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading} size="sm">
          {isLoading
            ? "Guardando..."
            : mode === "create"
              ? "Crear Proveedor"
              : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
