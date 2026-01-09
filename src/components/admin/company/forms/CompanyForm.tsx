"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CompanyData } from "@/services/admin/company";

interface CompanyFormProps {
  initialData?: Partial<CompanyData>;
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
  const [name, setName] = useState(initialData?.name || "");
  const [taxId, setTaxId] = useState(initialData?.taxId || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [commerceType, setCommerceType] = useState(initialData?.commerceType || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [vision, setVision] = useState(initialData?.vision || "");
  const [mission, setMission] = useState(initialData?.mission || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      name,
      taxId,
      country,
      department,
      commerceType,
      description,
      vision,
      mission,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="taxId">ID Fiscal</Label>
          <Input
            id="taxId"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="commerceType">Tipo de Comercio</Label>
          <Input
            id="commerceType"
            value={commerceType}
            onChange={(e) => setCommerceType(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="vision">Visión</Label>
        <Textarea
          id="vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="mission">Misión</Label>
        <Textarea
          id="mission"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
        </Button>
      </div>
    </form>
  );
}
