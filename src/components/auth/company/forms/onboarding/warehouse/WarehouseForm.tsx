"use client";

import { useTransition } from "react";
import { WarehouseFields } from "./components/WarehouseFields";
import { WarehouseActions } from "./components/WarehouseActions";
import { useWarehouseForm, WarehouseFormData } from "./hooks/useWarehouseForm";
import { saveWarehouseData } from "@/services/auth/company-registration/onboarding/actions";

interface WarehouseFormProps {
  initialData?: Partial<WarehouseFormData>;
  onBack?: () => void;
  onDataChange?: (data: WarehouseFormData) => void;
  onNext?: () => void;
}

export function WarehouseForm({
  initialData = {
    hasWarehouse: false,
    name: "",
    address: "",
    city: "",
    department: "",
    country: "",
    phone: "",
  },
  onBack = () => {},
  onDataChange,
  onNext = () => {},
}: WarehouseFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    hasWarehouse,
    name,
    address,
    city,
    department,
    country,
    phone,
    errors,
    setHasWarehouse,
    setName,
    setAddress,
    setCity,
    setDepartment,
    setCountry,
    setPhone,
    validateForm,
    getFormData,
  } = useWarehouseForm(initialData, onDataChange);

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
      saveWarehouseData(formData);
    });

    onNext?.();
  };

  const handleSkip = () => {
    const formData = new FormData();
    formData.append("hasWarehouse", "false");
    startTransition(() => {
      saveWarehouseData(formData);
    });

    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <WarehouseFields
        hasWarehouse={hasWarehouse}
        name={name}
        address={address}
        city={city}
        department={department}
        country={country}
        phone={phone}
        errors={errors}
        onHasWarehouseChange={setHasWarehouse}
        onNameChange={setName}
        onAddressChange={setAddress}
        onCityChange={setCity}
        onDepartmentChange={setDepartment}
        onCountryChange={setCountry}
        onPhoneChange={setPhone}
      />

      <WarehouseActions
        onBack={onBack}
        onSkip={handleSkip}
        hasWarehouse={hasWarehouse}
        isPending={isPending}
      />
    </form>
  );
}
