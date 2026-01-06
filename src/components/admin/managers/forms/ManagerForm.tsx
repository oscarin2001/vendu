"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useCompany } from "@/services/admin/company";
import {
  PersonalInfoSection,
  ContactInfoSection,
  EmploymentInfoSection,
} from "./components";
import { ManagerFormProps, FormErrors, SubmitData } from "./types";
import { useManagerFormValidation } from "./hooks/useManagerFormValidation";
import { useManagerFormState } from "./hooks/useManagerFormState";
import { Users } from "lucide-react";

export function ManagerForm({
  tenantId,
  initialData,
  branches,
  onSubmit,
  isLoading,
  mode = "create",
}: ManagerFormProps) {
  const { company } = useCompany(tenantId);
  const { validateField } = useManagerFormValidation();
  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formData,
    setFormData,
  } = useManagerFormState({ initialData, mode });
  const [errors, setErrors] = useState<FormErrors>({});

  // Update email domain when company loads in create mode
  useEffect(() => {
    if (mode === "create" && company && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: `@${company.slug}.com`,
      }));
    }
  }, [company, mode]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Validate field
    const error = validateField(field, value, formData);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 ManagerForm handleSubmit called, mode:", mode);
    console.log("📋 Form data:", formData);

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const field = key as string;
      const error = validateField(
        field,
        formData[field as keyof typeof formData],
        formData,
        mode
      );
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submitData: SubmitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ci: formData.ci,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        salary: formData.salary,
        branchIds: formData.branchIds || [],
        contributionType: formData.contributionType,
        hireDate: formData.hireDate,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Crear Gerente" : "Editar Gerente"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Agrega un nuevo gerente a tu equipo administrativo"
              : "Modifica la información del gerente"}
          </p>
        </div>
      </div>

      <PersonalInfoSection
        firstName={formData.firstName}
        lastName={formData.lastName}
        ci={formData.ci}
        errors={{
          firstName: errors.firstName,
          lastName: errors.lastName,
          ci: errors.ci,
        }}
        onChange={handleFieldChange}
      />

      <ContactInfoSection
        phone={formData.phone}
        email={formData.email}
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        errors={{
          phone: errors.phone,
          email: errors.email,
          password: errors.password,
          confirmPassword: errors.confirmPassword,
        }}
        mode={mode}
        onChange={handleFieldChange}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
      />

      <EmploymentInfoSection
        salary={formData.salary}
        contributionType={formData.contributionType}
        hireDate={formData.hireDate || new Date()}
        errors={{
          salary: errors.salary,
          contributionType: errors.contributionType,
          hireDate: errors.hireDate,
        }}
        onChange={handleFieldChange}
      />

      {errors.general && (
        <div className="text-center">
          <p className="text-sm text-red-500">{errors.general}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Guardando..."
            : mode === "create"
            ? "Crear Gerente"
            : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
