"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/services/admin/company/hooks/useCompany";
import { Eye, EyeOff, Mail, Lock, User, Building, X } from "lucide-react";

interface SubmitData {
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  password: string;
  salary?: number;
  branchIds: number[];
  contributionType: "none" | "contributes" | "paid";
  hireDate?: Date;
}

interface ManagerFormData extends SubmitData {
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  salary?: string;
  branchIds?: string;
  contributionType?: string;
  hireDate?: string;
  general?: string;
}

interface ManagerFormProps {
  tenantId: string;
  initialData?: {
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    email: string;
    salary?: number;
    branchIds: number[];
    contributionType?: "none" | "contributes" | "paid";
    hireDate?: Date;
  };
  branches: { id: number; name: string }[];
  onSubmit: (data: SubmitData) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function ManagerForm({
  tenantId,
  initialData,
  branches,
  onSubmit,
  isLoading,
  mode = "create",
}: ManagerFormProps) {
  const { company } = useCompany(tenantId);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ManagerFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    ci: initialData?.ci || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    password: "",
    confirmPassword: "",
    salary: initialData?.salary,
    branchIds: initialData?.branchIds || [],
    contributionType:
      initialData?.contributionType ||
      (!initialData?.salary || initialData.salary === 0 ? "none" : "paid"),
    hireDate: initialData?.hireDate || new Date(),
  });

  // Update email domain when company loads in create mode
  useEffect(() => {
    if (mode === "create" && company && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: `@${company.slug}.com`,
      }));
    }
  }, [company, mode]); // Removed formData.email to avoid dependency array size changes

  const validateField = (
    field: keyof ManagerFormData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ): string | undefined => {
    switch (field) {
      case "firstName":
        if (!value?.trim()) return "El nombre es requerido";
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        break;
      case "lastName":
        if (!value?.trim()) return "El apellido es requerido";
        if (value.length < 2)
          return "El apellido debe tener al menos 2 caracteres";
        break;
      case "ci":
        if (!value?.trim()) return "La cédula es requerida";
        if (!/^\d{6,10}$/.test(value))
          return "La cédula debe contener solo números (6-10 dígitos)";
        break;
      case "email":
        if (!value?.trim()) return "El correo electrónico es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Formato de correo inválido";
        if (company?.slug && !value.endsWith(`@${company.slug}.com`)) {
          return `El correo debe terminar en @${company.slug}.com`;
        }
        break;
      case "password":
        if (mode === "create") {
          if (!value?.trim()) return "La contraseña es requerida";
          if (value.length < 8)
            return "La contraseña debe tener al menos 8 caracteres";
          if (!/[A-Z]/.test(value))
            return "La contraseña debe contener al menos una mayúscula";
        }
        break;
      case "confirmPassword":
        if (mode === "create") {
          if (!value?.trim())
            return "La confirmación de contraseña es requerida";
          if (value !== formData.password)
            return "Las contraseñas no coinciden";
        }
        break;
      case "salary":
        if (value !== undefined && value !== null && value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue < 0)
            return "El salario debe ser un número positivo";
        }
        break;
      case "contributionType":
        if (!value) return "Debe seleccionar el tipo de contribución";
        break;
      case "hireDate":
        if (!value) return "La fecha de contratación es requerida";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Fecha inválida";
        if (date > new Date()) return "La fecha no puede ser futura";
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const field = key as keyof ManagerFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData; // eslint-disable-line @typescript-eslint/no-unused-vars
    onSubmit(submitData as SubmitData);
  };

  const handleChange = (
    field: keyof ManagerFormData,
    value: string | number | null | undefined
  ) => {
    let processedValue: string | number | null | undefined | Date = value;

    // Convertir hireDate de string a Date
    if (field === "hireDate" && typeof value === "string") {
      processedValue = value ? new Date(value) : undefined;
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: processedValue };

      // Si cambia el tipo de contribución, ajustar el salario automáticamente
      if (field === "contributionType") {
        if (value === "none") {
          newData.salary = 0;
        } else if (
          value === "contributes" &&
          (!prev.salary || prev.salary === 0)
        ) {
          newData.salary = undefined; // Permitir que ingrese un valor
        } else if (value === "paid" && (!prev.salary || prev.salary === 0)) {
          newData.salary = undefined; // Permitir que ingrese un valor
        }
      }

      return newData;
    });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Special validation for confirmPassword when password changes
    if (field === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBranchToggle = (branchId: number) => {
    setFormData((prev) => ({
      ...prev,
      branchIds: prev.branchIds.includes(branchId)
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId],
    }));
  };

  const removeBranch = (branchId: number) => {
    setFormData((prev) => ({
      ...prev,
      branchIds: prev.branchIds.filter((id) => id !== branchId),
    }));
  };

  const selectedBranches = branches.filter((branch) =>
    formData.branchIds.includes(branch.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Crear Encargado" : "Editar Encargado"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombres *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Ej: Juan Carlos"
                  className="pl-10"
                  required
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Apellidos *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Ej: Pérez López"
                  className="pl-10"
                  required
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ci">CI *</Label>
              <Input
                id="ci"
                value={formData.ci}
                onChange={(e) => handleChange("ci", e.target.value)}
                placeholder="Ej: 12345678"
                required
              />
              {errors.ci && (
                <p className="text-sm text-red-600 mt-1">{errors.ci}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hireDate">Fecha de Contratación *</Label>
              <Input
                id="hireDate"
                type="date"
                value={
                  formData.hireDate
                    ? formData.hireDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleChange("hireDate", e.target.value)}
                required
              />
              {errors.hireDate && (
                <p className="text-sm text-red-600 mt-1">{errors.hireDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: +591 76543210"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <div className="flex">
                  <Input
                    id="email"
                    type="text"
                    value={formData.email.replace(`@${company?.slug}.com`, "")}
                    onChange={(e) => {
                      const username = e.target.value;
                      const domain = company ? `@${company.slug}.com` : "";
                      handleChange("email", username + domain);
                    }}
                    placeholder="usuario"
                    className="pl-10 rounded-r-none border-r-0"
                    required
                  />
                  <div className="flex items-center px-3 bg-gray-50 border border-l-0 rounded-r-md text-gray-600 text-sm">
                    {company ? `@${company.slug}.com` : ""}
                  </div>
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {mode === "create" && (
              <>
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Mínimo 8 caracteres, 1 mayúscula"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      placeholder="Repite la contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="contributionType">
                Tipo de Contribución Financiera *
              </Label>
              <Select
                value={formData.contributionType}
                onValueChange={(value: "none" | "contributes" | "paid") =>
                  handleChange("contributionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de contribución" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No recibe compensación</SelectItem>
                  <SelectItem value="contributes">
                    Aporta a la empresa
                  </SelectItem>
                  <SelectItem value="paid">Empresa le paga</SelectItem>
                </SelectContent>
              </Select>
              {errors.contributionType && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.contributionType}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salary">
                Salario (BOB)
                {formData.contributionType === "none" && " - No aplica"}
                {formData.contributionType === "contributes" &&
                  " - Monto que aporta"}
                {formData.contributionType === "paid" && " - Monto que recibe"}
              </Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary || ""}
                onChange={(e) =>
                  handleChange(
                    "salary",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder={
                  formData.contributionType === "none"
                    ? "0"
                    : formData.contributionType === "contributes"
                    ? "Ej: 1000"
                    : "Ej: 5000"
                }
                min="0"
                step="0.01"
                disabled={formData.contributionType === "none"}
              />
              {errors.salary && (
                <p className="text-sm text-red-600 mt-1">{errors.salary}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Sucursales</Label>
              <div className="space-y-3">
                {/* Sucursales seleccionadas */}
                {selectedBranches.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedBranches.map((branch) => (
                      <Badge
                        key={branch.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Building className="h-3 w-3" />
                        {branch.name} (Tienda)
                        <button
                          type="button"
                          onClick={() => removeBranch(branch.id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Lista de sucursales disponibles */}
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="text-sm text-muted-foreground mb-2">
                    Seleccionar sucursales:
                  </div>
                  <div className="space-y-2">
                    {branches.map((branch) => {
                      const isSelected = formData.branchIds.includes(branch.id);
                      return (
                        <div
                          key={branch.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`branch-${branch.id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleBranchToggle(branch.id)
                            }
                          />
                          <Label
                            htmlFor={`branch-${branch.id}`}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            <Building className="h-3 w-3" />
                            {branch.name} (Tienda)
                          </Label>
                        </div>
                      );
                    })}
                    {branches.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No hay sucursales disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {errors.branchIds && (
                <p className="text-sm text-red-600 mt-1">{errors.branchIds}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Guardando..."
              : mode === "create"
              ? "Crear Encargado"
              : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
