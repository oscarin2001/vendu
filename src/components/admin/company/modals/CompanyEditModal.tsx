"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "@/components/admin/company/forms/CompanyForm";
import { CompanyData } from "@/services/admin/company";

interface CompanyEditModalProps {
  company: CompanyData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function CompanyEditModal({
  company,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompanyEditModalProps) {
  const initialData = company
    ? {
        name: company.name,
        taxId: company.taxId,
        country: company.country,
        department: company.department,
        commerceType: company.commerceType,
        description: company.description,
        vision: company.vision,
        mission: company.mission,
      }
    : undefined;

  const companyInfo = company
    ? {
        id: company.id,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>
        <CompanyForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          mode="edit"
          companyInfo={companyInfo}
        />
      </DialogContent>
    </Dialog>
  );
}
