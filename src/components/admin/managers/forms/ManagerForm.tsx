"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useCompany } from "@/services/admin/company";
import { useFormChanges } from "@/services/admin/shared/hooks/change-tracking";
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
  onEditRequest,
  isLoading,
  mode = "create",
  companyCountry,
  managerInfo,
  onCancel,
}: ManagerFormProps) {
  const { company } = useCompany(tenantId);
  const { validateField } = useManagerFormValidation(
    companyCountry ?? company?.country,
  );
  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formData,
    setFormData,
  } = useManagerFormState({ initialData, mode });
  const [errors, setErrors] = useState<FormErrors>({});

  // Track changes for edit mode
  const { hasChanges, changes } = useFormChanges({
    initialData: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          ci: initialData.ci,
          phone: initialData.phone,
          email: initialData.email,
          salary: initialData.salary,
          branchIds: initialData.branchIds,
          contributionType: initialData.contributionType,
          hireDate: initialData.hireDate,
          birthDate: initialData.birthDate,
          joinedAt: initialData.joinedAt,
          contractEndAt: initialData.contractEndAt,
          isIndefinite: initialData.isIndefinite,
          homeAddress: initialData.homeAddress,
        }
      : null,
    currentData: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      ci: formData.ci,
      phone: formData.phone,
      email: formData.email,
      salary: formData.salary,
      branchIds: formData.branchIds,
      contributionType: formData.contributionType,
      hireDate: formData.hireDate,
      birthDate: formData.birthDate,
      joinedAt: formData.joinedAt,
      contractEndAt: formData.contractEndAt,
      isIndefinite: formData.isIndefinite,
      homeAddress: formData.homeAddress,
    },
  });

  // Expose changes for parent component
  (ManagerForm as any).currentChanges = changes;
  (ManagerForm as any).hasChanges = hasChanges;

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
        mode,
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
        birthDate: formData.birthDate,
        joinedAt: formData.joinedAt,
        contractEndAt: formData.contractEndAt,
        isIndefinite: formData.isIndefinite,
        homeAddress: formData.homeAddress,
      };

      // In edit mode, delegate to parent to handle change reason dialog
      if (mode === "edit" && onEditRequest) {
        onEditRequest(submitData, changes);
      } else {
        onSubmit(submitData);
      }
    }
  };

  // Determine if submit button should be enabled
  const isSubmitDisabled = isLoading || (mode === "edit" && !hasChanges);

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
        birthDate={formData.birthDate}
        homeAddress={formData.homeAddress}
        country={companyCountry ?? company?.country}
        errors={{
          firstName: errors.firstName,
          lastName: errors.lastName,
          ci: errors.ci,
          birthDate: errors.birthDate,
          homeAddress: errors.homeAddress,
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
        country={companyCountry ?? company?.country}
        companySlug={company?.slug}
        errors={{
          phone: errors.phone,
          email: errors.email,
          password: errors.password,
          confirmPassword: errors.confirmPassword,
        }}
        mode={mode}
        onChange={handleFieldChange}
        onSetError={(field, error) =>
          setErrors((prev) => ({ ...prev, [field]: error }))
        }
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
      />

      <EmploymentInfoSection
        salary={formData.salary}
        contributionType={formData.contributionType}
        hireDate={formData.hireDate || new Date()}
        joinedAt={formData.joinedAt}
        contractEndAt={formData.contractEndAt}
        isIndefinite={formData.isIndefinite}
        country={companyCountry ?? company?.country}
        errors={{
          salary: errors.salary,
          contributionType: errors.contributionType,
          hireDate: errors.hireDate,
          joinedAt: errors.joinedAt,
          contractEndAt: errors.contractEndAt,
        }}
        onChange={handleFieldChange}
      />

      {errors.general && (
        <div className="text-center">
          <p className="text-xs text-red-500">{errors.general}</p>
        </div>
      )}

      {managerInfo && (
        <div>
          <div className="pt-4" />
          <div className="space-y-2">
            <div className="text-sm font-medium">Información del Sistema</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>{" "}
                <span className="font-medium">{managerInfo.id}</span>
              </div>
              {managerInfo.createdAt && (
                <div>
                  <span className="text-muted-foreground">Creado:</span>{" "}
                  <span className="font-medium">
                    {new Date(managerInfo.createdAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              )}
              {managerInfo.createdBy && (
                <div>
                  <span className="text-muted-foreground">Creado por:</span>{" "}
                  <span className="font-medium">
                    {managerInfo.createdBy.name}
                  </span>
                </div>
              )}
              {managerInfo.updatedAt && (
                <div>
                  <span className="text-muted-foreground">Modificado:</span>{" "}
                  <span className="font-medium">
                    {new Date(managerInfo.updatedAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              )}
              {managerInfo.updatedBy && (
                <div>
                  <span className="text-muted-foreground">Modificado por:</span>{" "}
                  <span className="font-medium">
                    {managerInfo.updatedBy.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

// Export changes getter for parent components
ManagerForm.getChanges = () => (ManagerForm as any).currentChanges || [];
ManagerForm.getHasChanges = () => (ManagerForm as any).hasChanges || false;
