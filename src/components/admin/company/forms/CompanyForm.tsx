"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CompanyData } from "@/services/admin/company/types/company.types";

interface CompanyFormProps {
  initialData?: {
    name: string;
    taxId?: string;
    country: string;
    address?: string;
  };
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  companyInfo?: {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
  };
}

export function CompanyForm({
  initialData,
  onSubmit,
  isLoading,
  mode = "edit",
  companyInfo,
}: CompanyFormProps) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    taxId: initialData?.taxId || "",
    country: initialData?.country || "",
    address: initialData?.address || "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Crear Empresa" : "Editar Empresa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mode === "edit" && companyInfo && (
          <div className="mb-6">
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Información de Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">
                      ID de Empresa
                    </Label>
                    <p className="font-medium">#{companyInfo.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Fecha de Creación
                    </Label>
                    <p className="font-medium">
                      {new Date(companyInfo.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Última Actualización
                    </Label>
                    <p className="font-medium">
                      {companyInfo.updatedAt
                        ? new Date(companyInfo.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Nunca"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre de la Empresa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Mi Empresa S.R.L."
                required
              />
            </div>
            <div>
              <Label htmlFor="taxId">NIT</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                placeholder="Número de identificación tributaria"
              />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Ej: Bolivia"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Dirección Principal</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección de la empresa"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Guardando..."
              : mode === "create"
              ? "Crear Empresa"
              : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
