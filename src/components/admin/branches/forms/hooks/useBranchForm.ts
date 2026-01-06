"use client";

import { useState, useEffect } from "react";

interface BranchFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  country: string;
}

interface UseBranchFormProps {
  initialData?: Partial<BranchFormData>;
}

export function useBranchForm({ initialData }: UseBranchFormProps) {
  const [formData, setFormData] = useState<BranchFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    department: initialData?.department || "",
    country: initialData?.country || "",
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Updating form data with initialData:", initialData);
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        department: initialData.department || "",
        country: initialData.country || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      department: "",
      country: "",
    });
  };

  return {
    formData,
    handleChange,
    resetForm,
  };
}
