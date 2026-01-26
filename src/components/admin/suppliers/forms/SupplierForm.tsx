"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useFormChanges } from "@/services/admin/shared/hooks/change-tracking";
import { getCountryConfigByName } from "@/services/admin/config/types/countries";
import {
  SupplierPersonalSection,
  SupplierContactSection,
  SupplierLocationSection,
  SupplierContractSection,
  SupplierNotesSection,
} from "./components";
import { SupplierFormProps, SupplierFormData, SUPPLIER_LIMITS } from "./types";

export function SupplierForm({
  initialData,
  onSubmit,
  onEditRequest,
  isLoading,
  mode,
  companyCountry,
  onCancel,
}: SupplierFormProps) {
  const fixedCountry = companyCountry || initialData?.country;
  const countryConfig = getCountryConfigByName(fixedCountry);
  const phonePrefix = countryConfig?.phone.prefix ?? "591";
  const phoneLocalLength = countryConfig?.phone.local ?? 8;

  const [formData, setFormData] = useState<SupplierFormData>(() => {
    const initialCountry = initialData?.country || fixedCountry;
    const computedIsForeign =
      initialData?.isForeign ??
      (initialData?.country && companyCountry
        ? initialData.country !== companyCountry
        : false);

    return {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      ci: initialData?.ci || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      department: initialData?.department || "",
      country: initialCountry,
      notes: initialData?.notes || "",
      birthDate: initialData?.birthDate
        ? new Date(initialData.birthDate)
        : null,
      partnerSince: initialData?.partnerSince
        ? new Date(initialData.partnerSince)
        : null,
      contractEndAt: initialData?.contractEndAt
        ? new Date(initialData.contractEndAt)
        : null,
      isIndefinite: initialData?.isIndefinite || false,
      isForeign: computedIsForeign,
    } as SupplierFormData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { hasChanges, changes } = useFormChanges({
    initialData: initialData || null,
    currentData: formData,
  });

  // Expose for parent
  (SupplierForm as any).currentChanges = changes;
  (SupplierForm as any).hasChanges = hasChanges;

  const handleChange = (field: keyof SupplierFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const setError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
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

    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const localDigits = phoneDigits.startsWith(phonePrefix)
        ? phoneDigits.slice(phonePrefix.length)
        : phoneDigits;
      if (localDigits.length > 0 && localDigits.length !== phoneLocalLength) {
        newErrors.phone = `El teléfono debe tener ${phoneLocalLength} dígitos`;
      }
    }

    if (formData.city && /\d/.test(formData.city)) {
      newErrors.city = "La ciudad no puede contener números";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      email: formData.email?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      city: formData.city?.trim() || undefined,
      department: formData.department?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    // `isForeign` is a UI-only flag — do not send to the backend
    if ((submitData as any).isForeign !== undefined) {
      delete (submitData as any).isForeign;
    }

    if (mode === "edit" && onEditRequest) {
      onEditRequest(submitData, changes);
    } else {
      onSubmit(submitData);
    }
  };

  const isSubmitDisabled = isLoading || (mode === "edit" && !hasChanges);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Truck className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Nuevo Proveedor" : "Editar Proveedor"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Registra un nuevo proveedor"
              : "Modifica la información del proveedor"}
          </p>
        </div>
      </div>

      <SupplierPersonalSection
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />

      <SupplierContactSection
        formData={formData}
        errors={errors}
        companyCountry={fixedCountry}
        onChange={handleChange}
        setError={setError}
      />

      <SupplierLocationSection
        formData={formData}
        errors={errors}
        companyCountry={fixedCountry}
        onChange={handleChange}
      />

      <SupplierContractSection formData={formData} onChange={handleChange} />

      <SupplierNotesSection formData={formData} onChange={handleChange} />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCancel?.()}
        >
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

SupplierForm.getChanges = () => (SupplierForm as any).currentChanges || [];
SupplierForm.getHasChanges = () => (SupplierForm as any).hasChanges || false;
