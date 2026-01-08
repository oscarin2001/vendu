"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/company/auth-form";
import { OnboardingFlow } from "@/components/auth/company/OnboardingFlow";
import { Stepper } from "@/components/auth/company/onboarding/Stepper";
import { loginAction, type LoginResult } from "@/services/auth/login/actions";
import { registerAction } from "@/services/auth/register/actions";

export default function RegisterCompanyForm() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    | "company-name"
    | "company-details"
    | "owner"
    | "fiscal"
    | "legal"
    | "confirmation"
  >("company-name");
  const [onboardingData, setOnboardingData] = useState({
    companyName: {
      name: "",
      country: "",
      phone: "",
      department: "",
      commerceType: "",
      description: "",
      vision: "",
      mission: "",
      openedAt: "",
    },
    owner: {
      firstName: "",
      lastName: "",
      phone: "",
      ci: "",
      gender: "",
    },
    fiscal: { taxId: "", businessName: "", fiscalAddress: "" },
    legal: { tosAccepted: false, tosRead: false },
  });

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "login" ? "login" : "register";

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persistencia del progreso: limpiar si se solicita login
  useEffect(() => {
    if (mode === "login") {
      try {
        localStorage.removeItem("onboarding-progress");
        localStorage.removeItem("onboarding-data");
      } catch (e) {
        // noop
      }
      setShowOnboarding(false);
      return;
    }

    const savedProgress = localStorage.getItem("onboarding-progress");
    if (savedProgress) {
      try {
        const { currentStep: savedStep, onboardingData: savedData } =
          JSON.parse(savedProgress);
        setCurrentStep(savedStep);
        setOnboardingData(savedData);
        setShowOnboarding(true);
      } catch (error) {
        console.error("Error loading onboarding progress:", error);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (showOnboarding) {
      const progress = { currentStep, onboardingData };
      localStorage.setItem("onboarding-progress", JSON.stringify(progress));
    }
  }, [currentStep, onboardingData, showOnboarding]);

  const handleStepBack = () => {
    const steps = [
      "company-name",
      "company-details",
      "owner",
      "fiscal",
      "legal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as any);
    }
  };

  const handleAuthSubmit = async (credentials: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const formData = new FormData();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);
        const result: LoginResult = await loginAction(null, formData);

        if (!result || "error" in result) {
          setAuthError("Usuario y/o contraseña incorrectos");
          return;
        }

        // Si el onboarding está pendiente (o se requiere), mostramos el flujo en la misma página
        if ("onboardingRequired" in result || !result.onboardingCompleted) {
          try {
            const { toast } = await import("sonner");
            toast.info("Debes completar tu onboarding para continuar");
          } catch (_) {
            // Si sonner no carga, seguimos sin interrumpir el flujo
          }
          setShowOnboarding(true);
          return;
        }

        const destination = result.redirectTo
          ? result.redirectTo
          : `/vendu/dashboard/${result.slug}/admin`;

        window.location.href = destination;
        return;
      }

      // register
      const formData = new FormData();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);
      formData.append("email", credentials.email);
      const result = await registerAction(null, formData);
      if (result.error) {
        setAuthError(result.error);
        return;
      }
      setShowOnboarding(true);
    } catch (err: any) {
      setAuthError(err?.message || "Error al realizar la operación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepComplete = (step: string, data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      [step]: data,
    }));

    const steps = [
      "company-name",
      "company-details",
      "owner",
      "fiscal",
      "legal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as any);
    } else if (step === "confirmation") {
      // Onboarding completed, generate slug and redirect
      const companyName = onboardingData.companyName.name;
      const slug = companyName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      // Clear progress
      localStorage.removeItem("onboarding-progress");
      // Redirect to dashboard
      window.location.href = `/vendu/dashboard/${slug}/admin/company`;
    }
  };

  const handleDataChange = (data: Record<string, unknown>) => {
    setOnboardingData((prev) => {
      const hasChanges = Object.entries(data).some(([key, value]) => {
        return (
          JSON.stringify(prev[key as keyof typeof prev]) !==
          JSON.stringify(value)
        );
      });

      if (!hasChanges) {
        return prev;
      }

      return {
        ...prev,
        ...data,
      };
    });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Vendu
          </a>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-xs space-y-6 text-sm">
            {showOnboarding ? (
              <>
                <Stepper currentStep={currentStep} />
                <Suspense
                  fallback={
                    <div className="text-center text-sm text-white/60">
                      Cargando...
                    </div>
                  }
                >
                  <OnboardingFlow
                    currentStep={currentStep}
                    onboardingData={onboardingData}
                    onStepComplete={handleStepComplete}
                    onDataChange={handleDataChange}
                    onStepBack={handleStepBack}
                  />
                </Suspense>
              </>
            ) : (
              <Suspense
                fallback={
                  <div className="text-center text-sm text-white/60">
                    Cargando...
                  </div>
                }
              >
                <AuthForm
                  mode={mode}
                  onSubmit={handleAuthSubmit}
                  error={authError || undefined}
                  isLoading={isSubmitting}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
