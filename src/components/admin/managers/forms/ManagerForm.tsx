"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompany } from "@/services/admin/company/hooks/useCompany";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";

interface SubmitData {
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  password: string;
  salary?: number;
  branchId: number | null;
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
  branchId?: string;
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
    branchId: number | null;
  };
  branches: { id: number; name: string; isWarehouse: boolean }[];
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
    branchId: initialData?.branchId || null,
  });

  const validateField = (field: keyof ManagerFormData, value: any): string | undefined => {
    switch (field) {
      case "firstName":
        if (!value?.trim()) return "El nombre es requerido";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        break;
      case "lastName":
        if (!value?.trim()) return "El apellido es requerido";
        if (value.length < 2) return "El apellido debe tener al menos 2 caracteres";
        break;
      case "ci":
        if (!value?.trim()) return "La cédula es requerida";
        if (!/^\d{6,10}$/.test(value)) return "La cédula debe contener solo números (6-10 dígitos)";
        break;
      case "email":
        if (!value?.trim()) return "El correo electrónico es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Formato de correo inválido";
        if (company?.slug && !value.endsWith(`@${company.slug}.com`)) {
          return `El correo debe terminar en @${company.slug}.com`;
        }
        break;
      case "password":
        if (mode === "create") {
          if (!value?.trim()) return "La contraseña es requerida";
          if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
          if (!/[A-Z]/.test(value)) return "La contraseña debe contener al menos una mayúscula";
        }
        break;
      case "confirmPassword":
        if (mode === "create") {
          if (!value?.trim()) return "La confirmación de contraseña es requerida";
          if (value !== formData.password) return "Las contraseñas no coinciden";
        }
        break;
      case "salary":
        if (value !== undefined && value !== null && value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue < 0) return "El salario debe ser un número positivo";
        }
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

  const handleChange = (field: keyof ManagerFormData, value: string | number | null | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Special validation for confirmPassword when password changes
    if (field === "password" && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

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
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder={`Ej: juan.perez@${company?.slug}.com`}
                  className="pl-10"
                  required
                />
              </div>
              {company?.slug && (
                <p className="text-sm text-gray-500 mt-1">
                  El correo debe terminar en @{company.slug}.com
                </p>
              )}
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="Repite la contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <Label htmlFor="salary">Salario (BOB) - Opcional</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary || ""}
                onChange={(e) =>
                  handleChange("salary", e.target.value ? parseFloat(e.target.value) : undefined)
                }
                placeholder="Ej: 5000"
                min="0"
                step="0.01"
              />
              {errors.salary && (
                <p className="text-sm text-red-600 mt-1">{errors.salary}</p>
              )}
            </div>

            <div>
              <Label htmlFor="branch">Sucursal</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select
                  value={formData.branchId?.toString() || "none"}
                  onValueChange={(value) =>
                    handleChange(
                      "branchId",
                      value === "none" ? null : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin sucursal asignada</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name} {branch.isWarehouse ? "(Bodega)" : "(Tienda)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.branchId && (
                <p className="text-sm text-red-600 mt-1">{errors.branchId}</p>
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
