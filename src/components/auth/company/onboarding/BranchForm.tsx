"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";

interface BranchFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
  isWarehouse: boolean;
}

interface BranchFormProps {
  initialData?: Partial<BranchFormData>;
  onComplete?: (data: BranchFormData) => void;
  onBack?: () => void;
  onDataChange?: (data: BranchFormData) => void;
}

export function BranchForm({
  initialData,
  onComplete,
  onBack,
  onDataChange,
}: BranchFormProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "",
    isWarehouse: initialData?.isWarehouse || false,
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        department: initialData.department || "",
        country: initialData.country || "",
        isWarehouse: initialData.isWarehouse || false,
      });
    }
  }, [initialData]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (!formData.address.trim()) {
      return;
    }

    if (!formData.city.trim()) {
      return;
    }

    if (!formData.country.trim()) {
      return;
    }

    if (onComplete) {
      onComplete(formData);
    }
  };

  const handleChange = (field: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Configurar Sucursal Principal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nombre de la Sucursal *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Sucursal Centro"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Ej: +591 12345678"
              />
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Ej: Bolivia"
                required
              />
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="Ej: La Paz"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Ej: La Paz"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección completa de la sucursal"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isWarehouse}
                  onCheckedChange={(checked) =>
                    handleChange("isWarehouse", checked)
                  }
                />
                <span className="text-sm">
                  Esta sucursal también funcionará como bodega
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Atrás
              </Button>
            )}
            <Button type="submit" className="flex-1">
              Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
