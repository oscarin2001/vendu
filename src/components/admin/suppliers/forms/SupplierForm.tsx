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
import { Textarea } from "@/components/ui/textarea";
import {
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
} from "lucide-react";

interface SupplierFormData {
  supplierNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  department: string;
  country: string;
  notes: string;
  managerId?: number;
}

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  managers?: { id: number; name: string }[];
  onSubmit: (data: SupplierFormData) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function SupplierForm({
  initialData,
  managers = [],
  onSubmit,
  isLoading,
  mode,
}: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    supplierNumber: initialData?.supplierNumber || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "",
    notes: initialData?.notes || "",
    managerId: initialData?.managerId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SupplierFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierNumber.trim()) {
      newErrors.supplierNumber = "El número de proveedor es requerido";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Remove empty email if not provided
    const submitData = {
      ...formData,
      email: formData.email?.trim() || undefined,
      managerId: formData.managerId || undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {mode === "create" ? "Nuevo Proveedor" : "Editar Proveedor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier Number */}
            <div className="md:col-span-2">
              <Label htmlFor="supplierNumber">Número de Proveedor *</Label>
              <Input
                id="supplierNumber"
                value={formData.supplierNumber}
                onChange={(e) => handleChange("supplierNumber", e.target.value)}
                placeholder="Ej: PROV-001"
                required
                className={errors.supplierNumber ? "border-red-500" : ""}
              />
              {errors.supplierNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.supplierNumber}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Nombre del proveedor"
                  className={`pl-10 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Apellido del proveedor"
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Ej: +591 12345678"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="proveedor@empresa.com"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Ciudad"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Ej: La Paz"
              />
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country">País</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Ej: Bolivia"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Dirección completa"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Manager */}
            <div className="md:col-span-2">
              <Label htmlFor="manager">Encargado Asignado</Label>
              <Select
                value={formData.managerId?.toString() || "none"}
                onValueChange={(value) =>
                  handleChange(
                    "managerId",
                    value === "none" ? undefined : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar encargado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin encargado asignado</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Notas adicionales sobre el proveedor..."
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Guardando..."
              : mode === "create"
              ? "Crear Proveedor"
              : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
