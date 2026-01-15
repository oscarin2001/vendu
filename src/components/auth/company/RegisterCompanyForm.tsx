"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/company/auth-form";
import { OnboardingFlow } from "@/components/auth/company/OnboardingFlowNew";
import { Stepper } from "@/components/auth/company/onboarding/Stepper";
import {
  loginAction,
  type LoginResult,
  checkAuthStatus,
} from "@/services/auth/login/actions";
import { registerAction } from "@/services/auth/register/actions";

type StepType = "company" | "details" | "owner" | "fiscal" | "confirm";

export default function RegisterCompanyForm() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>("company");
  const [onboardingData, setOnboardingData] = useState({
    companyName: {
      name: "",
      country: "",
      phone: "",
      department: "",
      commerceType: "",
      description: "",
      openedAt: "",
    },
    owner: {
      firstName: "",
      lastName: "",
      phone: "",
      ci: "",
      gender: "",
      birthDate: "",
    },
    fiscal: { taxId: "", businessName: "", fiscalAddress: "" },
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialMode = useMemo(() => {
    return searchParams.get("mode") === "login" ? "login" : "register";
  }, [searchParams]);

  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref para evitar que el useEffect de limpieza cancele el onboarding tras login exitoso
  const skipCleanupRef = useRef(false);

  // Al montar, verificar si hay sesión con pending-onboarding para mostrar wizard automáticamente
  useEffect(() => {
    const checkPendingOnboarding = async () => {
      try {
        const status = await checkAuthStatus();
        if (status.authenticated && status.pendingOnboarding) {
          skipCleanupRef.current = true;
          setShowOnboarding(true);
        }
      } catch (e) {
        // noop
      }
    };
    checkPendingOnboarding();
  }, []);

  useEffect(() => {
    // Sincroniza el estado con la URL si cambia externamente
    const currentMode =
      searchParams.get("mode") === "login" ? "login" : "register";
    if (currentMode !== mode) {
      setMode(currentMode);
    }
  }, [searchParams, mode]);

  // Si el usuario ya inició un onboarding parcial, reabrir wizard al montar
  useEffect(() => {
    if (mode === "register") {
      try {
        const saved = localStorage.getItem("onboarding-progress");
        if (saved) {
          const { currentStep: savedStep, onboardingData: savedData } =
            JSON.parse(saved);
          if (savedStep) {
            setCurrentStep(savedStep as StepType);
          }
          if (savedData) {
            setOnboardingData(savedData);
          }
          setShowOnboarding(true);
        }
      } catch (e) {
        // noop
      }
    }
  }, [mode]);

  useEffect(() => {
    // Si estamos continuando onboarding tras login, saltamos la limpieza
    if (skipCleanupRef.current) {
      skipCleanupRef.current = false;
      return;
    }

    // Siempre limpia progreso al cambiar de modo para evitar abrir el wizard.
    try {
      localStorage.removeItem("onboarding-started");
      localStorage.removeItem("onboarding-progress");
      localStorage.removeItem("onboarding-data");
    } catch (e) {
      // noop
    }

    setShowOnboarding(false);
    setCurrentStep("company");
  }, [mode]);

  useEffect(() => {
    if (showOnboarding) {
      const progress = { currentStep, onboardingData };
      localStorage.setItem("onboarding-progress", JSON.stringify(progress));
      localStorage.setItem("onboarding-started", "true");
    }
  }, [currentStep, onboardingData, showOnboarding]);

  const handleStepBack = () => {
    const steps: StepType[] = [
      "company",
      "details",
      "owner",
      "fiscal",
      "confirm",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
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
          // Marcamos para evitar que el useEffect de limpieza cancele el onboarding
          skipCleanupRef.current = true;
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

    const steps: StepType[] = [
      "company",
      "details",
      "owner",
      "fiscal",
      "confirm",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else if (step === "confirm") {
      localStorage.removeItem("onboarding-progress");
      localStorage.removeItem("onboarding-started");
      localStorage.removeItem("onboarding-data");
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
                  onSwitchMode={(nextMode) => {
                    setMode(nextMode);
                    router.replace(`/register-company?mode=${nextMode}`);
                  }}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#60a5fa_0,transparent_30%),radial-gradient(circle_at_80%_0%,#a78bfa_0,transparent_25%),radial-gradient(circle_at_50%_80%,#f472b6_0,transparent_30%)]" />
      </div>
    </div>
  );
}
