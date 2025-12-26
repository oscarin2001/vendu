"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/ui/phone-input";

interface OwnerFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    phone: string;
    ci: string;
    gender: string;
  };
  onComplete: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    ci: string;
    gender: string;
  }) => void;
  onBack: () => void;
  onDataChange?: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    ci: string;
    gender: string;
  }) => void;
}

export function OwnerForm({
  initialData,
  onComplete,
  onBack,
  onDataChange,
}: OwnerFormProps) {
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [ci, setCi] = useState(initialData.ci || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    ci?: string;
    gender?: string;
  }>({});

  // Save data whenever it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ firstName, lastName, phone, ci, gender });
    }
  }, [firstName, lastName, phone, ci, gender]); // Removed onDataChange from dependencies

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      ci?: string;
      gender?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    if (!phone.trim()) {
      newErrors.phone = "El celular es requerido";
    }

    if (!ci.trim()) {
      newErrors.ci = "La cédula de identidad es requerida";
    } else if (ci.replace(/\D/g, "").length < 6) {
      newErrors.ci = "La CI debe tener al menos 6 dígitos";
    }

    if (!gender) {
      newErrors.gender = "Debe seleccionar un género";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete({ firstName, lastName, phone, ci, gender });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Juan"
          required
        />
        {errors.firstName && (
          <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Pérez"
          required
        />
        {errors.lastName && (
          <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Celular</FieldLabel>
        <PhoneInput
          value={phone}
          onChange={(val, valid) => setPhone(val)}
          placeholder="59112345678"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="ci">CI / Documento (opcional)</FieldLabel>
        <Input
          id="ci"
          value={ci}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Solo números
            setCi(value);
          }}
          placeholder="12345678"
          type="text"
          pattern="[0-9]+"
        />
      </Field>
      <Field>
        <FieldLabel>Sexo</FieldLabel>
        <RadioGroup value={gender} onValueChange={setGender}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="masculino" id="masculino" />
            <label htmlFor="masculino">Masculino</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="femenino" id="femenino" />
            <label htmlFor="femenino">Femenino</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="otro" id="otro" />
            <label htmlFor="otro">Otro</label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
        )}
      </Field>
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button type="submit" className="flex-1">
          Siguiente
        </Button>
      </div>
    </form>
  );
}
