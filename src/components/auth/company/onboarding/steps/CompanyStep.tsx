"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { CountrySelect } from "@/components/ui/country-select";
import { SlugPreview } from "../shared/SlugPreview";
import { UrlInfoModal } from "../shared/UrlInfoModal";
import { validateCompanyNameAction } from "@/services/auth/company-registration/onboarding-actions";
import { saveOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import {
  getCountryConfigByName,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
  validatePhoneByCountry,
} from "@/services/admin/config";
import { COUNTRIES as PHONE_COUNTRIES } from "@/components/ui/phone-input";
import { formatPhonePattern } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

interface CompanyStepProps {
  initialData?: {
    name: string;
    country: string;
    phone: string;
  };
  onDataChange?: (data: {
    name: string;
    country: string;
    phone: string;
  }) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function CompanyStep({
  initialData = { name: "", country: "", phone: "" },
  onDataChange,
  onNext = () => {},
}: CompanyStepProps) {
  const [name, setName] = useState(initialData.name);
  const COMPANY_NAME_MAX = 100;
  const [country, setCountry] = useState(initialData.country);
  const [phone, setPhone] = useState(initialData.phone);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phonePlaceholder, setPhonePlaceholder] = useState("XXXXXXXX");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [slugPreview, setSlugPreview] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");
  const [confirmImmutable, setConfirmImmutable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const countryConfig = getCountryConfigByName(country);

  const generateSlug = (companyName: string): string => {
    return companyName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  useEffect(() => {
    onDataChange?.({ name, country, phone });
    saveOnboardingData({ company: { name, country, phone } as any });
  }, [name, country, phone, onDataChange]);

  useEffect(() => {
    if (name.trim()) {
      setSlugPreview(generateSlug(name));
      setValidationStatus("idle");
    } else {
      setSlugPreview("");
    }
  }, [name]);

  const handleCountryChange = (val?: string) => {
    const next = val || "";
    setCountry(next);
    const found = PHONE_COUNTRIES.find(
      (c) =>
        c.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase() ===
        next
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase(),
    );
    if (found) {
      setPhonePlaceholder("XXXXXXXX");
      if (!phone) setPhone(found.code);
    }
    setPhoneError(null);
  };

  const handlePhoneChange = (val: string, valid: boolean) => {
    const config = getCountryConfigByName(country);
    const prefix = config?.phone.prefix ?? "";

    // Solo dígitos locales
    let digits = val.replace(/\D/g, "");
    let localDigits = digits;
    if (prefix && digits.startsWith(prefix)) {
      localDigits = digits.slice(prefix.length);
    }

    if (country && localDigits.length > 0) {
      const filtered = filterPhoneFirstDigit(localDigits, country);
      if (filtered !== localDigits) {
        const newVal = prefix ? prefix + filtered : filtered;
        setPhone(newVal);
        setPhoneValid(false);
        const firstHint = getPhoneStartDigitsHint(country);
        setPhoneError(
          firstHint ??
            "El número debe comenzar con un dígito válido para el país",
        );
        return;
      }
    }

    setPhone(val);
    const error =
      country && localDigits.length > 0
        ? validatePhoneByCountry(val, country)
        : null;
    setPhoneValid(!error && valid);

    if (country && localDigits.length > 0) {
      setPhoneError(error);
    } else {
      setPhoneError(null);
    }
  };

  const handleNameBlur = async () => {
    if (!name.trim() || name.trim().length < 2) return;
    setValidationStatus("loading");
    try {
      const result = await validateCompanyNameAction(name);
      setValidationStatus(
        result.success && result.isAvailable ? "available" : "unavailable",
      );
    } catch {
      setValidationStatus("unavailable");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country || !phone) return;
    if (phoneValid === false || phoneError) return;
    if (!confirmImmutable) return;
    if (validationStatus !== "available") return;
    setIsPending(true);
    try {
      onNext();
    } finally {
      setIsPending(false);
    }
  };

  const isValid =
    name.trim() &&
    country &&
    phone &&
    confirmImmutable &&
    validationStatus === "available";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Nombre de la empresa</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Mi empresa S.R.L."
          required
          maxLength={COMPANY_NAME_MAX}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {name.length}/{COMPANY_NAME_MAX} caracteres
        </p>
        <SlugPreview
          slug={slugPreview}
          status={validationStatus}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="country">País</Label>
        <CountrySelect
          value={country}
          onChange={handleCountryChange}
          placeholder="Selecciona tu país"
        />
      </div>

      <div>
        <Label htmlFor="phone">Celular de contacto</Label>
        <PhoneInput
          value={phone}
          onChange={handlePhoneChange}
          placeholder={"XXXXXXXX"}
          required
          fixedCountryCode={countryConfig?.phone.prefix}
          fixedLocalMax={countryConfig?.phone.local}
          hideCountrySelect
          showValidation={false}
          showFormatHint={false}
        />
        {phoneError && (
          <p className="text-sm text-red-500 mt-1">{phoneError}</p>
        )}
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
        <Checkbox
          checked={confirmImmutable}
          onCheckedChange={(checked) => {
            if (checked) {
              setShowModal(true);
            } else {
              setConfirmImmutable(false);
            }
          }}
          className="mt-0.5"
        />
        <span className="text-sm text-muted-foreground">
          Confirmo que el nombre y país son correctos. Entiendo que no podré
          cambiarlos después.
        </span>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={!isValid || isPending}>
          Siguiente
        </Button>
      </div>

      <UrlInfoModal
        open={showModal}
        onOpenChange={setShowModal}
        currentSlug={slugPreview}
        onConfirm={() => setConfirmImmutable(true)}
      />
    </form>
  );
}
