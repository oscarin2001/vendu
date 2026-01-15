"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { SlugPreview } from "../shared/SlugPreview";
import { UrlInfoModal } from "../shared/UrlInfoModal";
import { validateCompanyNameAction } from "@/services/auth/company-registration/onboarding-actions";
import { Info } from "lucide-react";

interface Step1Props {
  data: { name: string };
  setData: (data: any) => void;
  onNext: () => void;
}

export function Step1({ data, setData, onNext }: Step1Props) {
  const [isPending, setIsPending] = useState(false);
  const [slugPreview, setSlugPreview] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");
  const [confirmImmutable, setConfirmImmutable] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const generateSlug = (companyName: string): string => {
    return companyName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (value: string) => {
    setData({ ...data, name: value });
    if (value.trim()) {
      const slug = generateSlug(value);
      setSlugPreview(slug);
      setValidationStatus("idle");
    } else {
      setSlugPreview("");
      setValidationStatus("idle");
    }
  };

  const handleNameBlur = async () => {
    if (!data.name.trim() || data.name.trim().length < 2) return;
    setValidationStatus("loading");
    try {
      const result = await validateCompanyNameAction(data.name);
      setValidationStatus(
        result.success && result.isAvailable ? "available" : "unavailable"
      );
    } catch {
      setValidationStatus("unavailable");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmImmutable) {
      alert("Debes confirmar que el nombre es correcto.");
      return;
    }
    if (validationStatus !== "available") {
      alert("El nombre debe estar disponible.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Información de la Empresa</h2>
        <p className="text-muted-foreground">
          Configura el nombre de tu empresa y su URL única.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre de la empresa</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Mi empresa S.R.L."
            required
          />
        </div>

        <SlugPreview slug={slugPreview} status={validationStatus} />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmImmutable}
            onChange={(e) => setConfirmImmutable(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="confirm" className="text-sm">
            Confirmo que el nombre de la empresa se convertirá en mi URL única.
          </Label>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            isPending || !confirmImmutable || validationStatus !== "available"
          }
        >
          Siguiente
        </Button>
      </div>

      <UrlInfoModal open={showModal} onOpenChange={setShowModal} />
    </form>
  );
}
