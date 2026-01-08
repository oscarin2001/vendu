"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import CompanyDetailsCard from "./CompanyDetailsCard";

interface CompanyFormProps {
  initialData?: {
    name: string;
    country: string;
    phone: string;
    department?: string;
    commerceType?: string;
    description?: string;
    vision?: string;
    mission?: string;
    openedAt?: string;
  };
  onDataChange?: (data: {
    name: string;
    country: string;
    phone: string;
    department?: string;
    commerceType?: string;
    description?: string;
    vision?: string;
    mission?: string;
    openedAt?: string;
  }) => void;
  onNext?: () => void;
}

export function CompanyForm({
  initialData = { name: "", country: "", phone: "" },
  onDataChange,
  onNext = () => {},
}: CompanyFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState(initialData.name || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [department, setDepartment] = useState<string | undefined>(
    initialData.department || ""
  );
  const [commerceType, setCommerceType] = useState<string | undefined>(
    initialData.commerceType || "Ropa usada"
  );
  const [description, setDescription] = useState<string | undefined>(
    initialData.description || ""
  );
  const [vision, setVision] = useState<string | undefined>(
    initialData.vision || ""
  );
  const [mission, setMission] = useState<string | undefined>(
    initialData.mission || ""
  );
  const [openedAt, setOpenedAt] = useState<string | undefined>(
    initialData.openedAt || ""
  );
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phonePlaceholder, setPhonePlaceholder] =
    useState<string>("59112345678");

  const [errors, setErrors] = useState<{
    name?: string;
    country?: string;
    phone?: string;
    openedAt?: string;
  }>({});

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        name,
        country,
        phone,
        department,
        commerceType,
        description,
        vision,
        mission,
        openedAt,
      });
    }
    saveOnboardingData({
      company: {
        name,
        country,
        phone,
        department,
        commerceType,
        description,
        vision,
        mission,
        openedAt,
      },
    });
  }, [
    name,
    country,
    phone,
    department,
    commerceType,
    description,
    vision,
    mission,
    openedAt,
    onDataChange,
  ]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      country?: string;
      phone?: string;
      openedAt?: string;
    } = {};

    if (!name.trim()) newErrors.name = "El nombre de la empresa es requerido";
    else if (name.trim().length < 2)
      newErrors.name = "El nombre debe tener al menos 2 caracteres";

    if (!country) newErrors.country = "Debe seleccionar un país";

    if (!phone.trim()) newErrors.phone = "El celular es requerido";
    else if (phoneValid === false)
      newErrors.phone =
        "El celular tiene formato inválido para el país seleccionado";
    else if (!phoneValid && phone.replace(/\D/g, "").length < 8)
      newErrors.phone = "El celular debe tener al menos 8 dígitos";

    if (!openedAt) newErrors.openedAt = "Indica la fecha de apertura física";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPending(true);
    onNext?.();
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyDetailsCard
        name={name}
        setName={setName}
        country={country}
        setCountry={setCountry}
        phone={phone}
        setPhone={setPhone}
        phoneValid={phoneValid}
        setPhoneValid={setPhoneValid}
        department={department}
        setDepartment={setDepartment}
        phonePlaceholder={phonePlaceholder}
        setPhonePlaceholder={setPhonePlaceholder}
        commerceType={commerceType}
        setCommerceType={setCommerceType}
        description={description}
        setDescription={setDescription}
        vision={vision}
        setVision={setVision}
        mission={mission}
        setMission={setMission}
        openedAt={openedAt}
        setOpenedAt={setOpenedAt}
        openedAtError={errors.openedAt}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}
