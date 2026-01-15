"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Building2,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { TermsModal } from "../TermsModal";
import { createCompanyFromOnboardingAction } from "@/services/auth/company-registration/onboarding/actions";
import {
  getOnboardingData,
  clearOnboardingData,
} from "@/services/auth/company-registration/onboarding/session";
import { toast } from "sonner";

interface ConfirmStepProps {
  data: any;
  onBack?: () => void;
}

export function ConfirmStep({ data, onBack = () => {} }: ConfirmStepProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tosAccepted, setTosAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tosAccepted) {
      setShowTerms(true);
    }
  }, [tosAccepted]);

  const summaryItems = [
    {
      icon: Building2,
      label: "Empresa",
      value: data.companyName?.name || "—",
      ok: !!data.companyName?.name,
    },
    {
      icon: Building2,
      label: "País",
      value: data.companyName?.country || "—",
      ok: !!data.companyName?.country,
    },
    {
      icon: User,
      label: "Responsable",
      value:
        `${data.owner?.firstName || ""} ${data.owner?.lastName || ""}`.trim() ||
        "—",
      ok: !!data.owner?.firstName,
    },
    {
      icon: FileText,
      label: "Fiscal",
      value: data.fiscal?.taxId ? "Configurado" : "No configurado",
      ok: true,
    },
  ];

  const handleComplete = () => {
    if (!tosAccepted) {
      setError("Debes aceptar los Términos de Uso");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        const sessionData = await getOnboardingData();
        const result = await createCompanyFromOnboardingAction({
          ...sessionData,
          tosAccepted,
        } as any);
        if (result.success && result.company) {
          toast.success("¡Empresa creada exitosamente!");
          clearOnboardingData();
          router.push(`/vendu/dashboard/${result.company.slug}/admin/company`);
        } else {
          toast.error(result.error || "Error al crear la empresa");
        }
      } catch {
        toast.error("Error inesperado");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-emerald-700" />
        </div>
        <h2 className="text-xl font-bold">¡Casi listo!</h2>
        <p className="text-sm text-muted-foreground">
          Revisa tu información y acepta los términos
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  item.ok ? "text-foreground" : "text-amber-600"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAcknowledge={() => setTosAccepted(true)}
        companyName={data.companyName?.name || "Tu empresa"}
      />

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
        >
          Atrás
        </Button>
        <Button onClick={handleComplete} disabled={isPending || !tosAccepted}>
          {isPending ? "Creando..." : "Crear Empresa"}
        </Button>
      </div>
    </div>
  );
}
