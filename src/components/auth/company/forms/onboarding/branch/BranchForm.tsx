"use client";

import { useTransition } from "react";
import { BranchFields } from "./components/BranchFields";
import { BranchActions } from "./components/BranchActions";
import { useBranchForm, BranchFormData } from "./hooks/useBranchForm";
import { saveBranchData } from "@/services/auth/company-registration/onboarding/actions";

interface BranchFormProps {
  initialData?: Partial<BranchFormData>;
  onBack?: () => void;
  onDataChange?: (data: BranchFormData) => void;
  onNext?: () => void;
}

export function BranchForm({
  initialData = {
    name: "",
    address: "",
    city: "",
    department: "",
    country: "",
    phone: "",
    isWarehouse: false,
  },
  onBack = () => {},
  onDataChange,
  onNext = () => {},
}: BranchFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    name,
    address,
    city,
    department,
    country,
    phone,
    isWarehouse,
    errors,
    setName,
    setAddress,
    setCity,
    setDepartment,
    setCountry,
    setPhone,
    setIsWarehouse,
    validateForm,
    getFormData,
  } = useBranchForm(initialData, onDataChange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    const data = getFormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => {
      saveBranchData(formData);
    });

    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BranchFields
        name={name}
        address={address}
        city={city}
        department={department}
        country={country}
        phone={phone}
        isWarehouse={isWarehouse}
        errors={errors}
        onNameChange={setName}
        onAddressChange={setAddress}
        onCityChange={setCity}
        onDepartmentChange={setDepartment}
        onCountryChange={setCountry}
        onPhoneChange={setPhone}
        onIsWarehouseChange={setIsWarehouse}
      />

      <BranchActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
