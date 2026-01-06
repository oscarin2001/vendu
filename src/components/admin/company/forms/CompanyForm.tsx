"use client";

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
  return (
    <div>
      <h3>{mode === "create" ? "Crear Empresa" : "Editar Empresa"}</h3>
      {/* TODO: Implement form */}
    </div>
  );
}
