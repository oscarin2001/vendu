"use client";

import { useState, useEffect } from "react";

interface CompanyFormData {
  name: string;
  taxId?: string;
  country: string;
  address?: string;
}

interface UseCompanyFormProps {
  initialData?: Partial<CompanyFormData>;
}

export function useCompanyForm({ initialData }: UseCompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData?.name || "",
    taxId: initialData?.taxId || "",
    country: initialData?.country || "",
    address: initialData?.address || "",
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        taxId: initialData.taxId || "",
        country: initialData.country || "",
        address: initialData.address || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof CompanyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      taxId: "",
      country: "",
      address: "",
    });
  };

  return {
    formData,
    handleChange,
    resetForm,
  };
}
