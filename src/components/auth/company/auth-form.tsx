"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/ui/loading";
import { Stepper } from "./onboarding/Stepper";
import { AuthStep } from "./AuthStep";
import { OnboardingFlow } from "./OnboardingFlow";
import { completeCompanyRegistrationAction } from "@/services/auth/company-registration/actions";
import { Receipt } from "lucide-react";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    | "auth"
    | "company-name"
    | "owner"
    | "branch"
    | "warehouse"
    | "fiscal"
    | "confirmation"
  >("auth");

  const [isLoading, setIsLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [onboardingData, setOnboardingData] = useState({
    companyName: { name: "", country: "", phone: "" },
    owner: { firstName: "", lastName: "", phone: "", ci: "", gender: "" },
    branch: {
      name: "",
      address: "",
      city: "",
      department: "",
      country: "",
      phone: "",
      isWarehouse: false,
    },
    warehouse: {
      hasWarehouse: false,
      name: "",
      address: "",
      city: "",
      department: "",
      country: "",
      phone: "",
    },
    fiscal: { taxId: "", businessName: "", fiscalAddress: "" },
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("onboarding-step");
    const savedData = localStorage.getItem("onboarding-data");

    if (savedStep && savedStep !== "auth") {
      setCurrentStep(savedStep as typeof currentStep);

      // Show resume notification
      setTimeout(() => {
        toast.info(
          "¡Bienvenido de vuelta! Continuemos con el registro de tu empresa.",
          {
            description: `Continuando desde el paso: ${getStepLabel(
              savedStep
            )}`,
          }
        );
      }, 1000);
    }

    // Restore saved credentials
    const savedCredentials = localStorage.getItem("onboarding-credentials");
    if (savedCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);
        setCredentials(parsedCredentials);
      } catch (error) {
        console.error("Error parsing saved credentials:", error);
        localStorage.removeItem("onboarding-credentials");
      }
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setOnboardingData(parsedData);
      } catch (error) {
        console.error("Error parsing saved onboarding data:", error);
        toast.error(
          "Error al cargar datos guardados. Comenzaremos desde el inicio."
        );
        // Clear corrupted data
        localStorage.removeItem("onboarding-step");
        localStorage.removeItem("onboarding-data");
        localStorage.removeItem("onboarding-credentials");
      }
    }
  }, []);

  // Get tenantId from URL params
  useEffect(() => {
    const tenantIdParam = searchParams.get("tenantId");
    if (tenantIdParam) {
      setTenantId(tenantIdParam);
    }
  }, [searchParams]);

  // Helper function to get step labels
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      "company-name": "Nombre de la empresa",
      owner: "Información del propietario",
      branch: "Sucursal principal",
      warehouse: "Bodega",
      fiscal: "Información fiscal",
      confirmation: "Confirmación",
    };
    return labels[step] || step;
  };

  // Save data to localStorage whenever it changes
  const saveOnboardingData = (data: Partial<typeof onboardingData>) => {
    const updatedData = { ...onboardingData, ...data };
    setOnboardingData(updatedData);
    localStorage.setItem("onboarding-data", JSON.stringify(updatedData));
  };

  // Handle registration success and move to onboarding
  const handleRegistrationSuccess = (credentials: {
    username: string;
    password: string;
  }) => {
    setCredentials(credentials);
    // Save credentials to localStorage for persistence
    localStorage.setItem("onboarding-credentials", JSON.stringify(credentials));
    setCurrentStep("company-name");
    localStorage.setItem("onboarding-step", "company-name");
  };

  // Handle onboarding step completion
  const handleStepComplete = async (step: string, data: any) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setOnboardingData((prev) => ({ ...prev, [step]: data }));

    const steps = [
      "company-name",
      "owner",
      "branch",
      "warehouse",
      "fiscal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1] as typeof currentStep;
      setCurrentStep(nextStep);
      localStorage.setItem("onboarding-step", nextStep);
    } else {
      // Final step - complete registration
      try {
        if (!credentials) {
          console.error("No credentials found in state - redirecting to auth");
          toast.error(
            "Sesión expirada. Por favor, comienza el registro nuevamente."
          );
          // Reset to auth step
          setCurrentStep("auth");
          localStorage.removeItem("onboarding-step");
          localStorage.removeItem("onboarding-data");
          localStorage.removeItem("onboarding-credentials");
          return;
        }

        const result = await completeCompanyRegistrationAction({
          username: credentials.username,
          password: credentials.password,
          companyName: onboardingData.companyName,
          owner: onboardingData.owner,
          branch: onboardingData.branch,
          warehouse: onboardingData.warehouse,
          fiscal: onboardingData.fiscal,
        });

        if (result.success) {
          toast.success("¡Empresa registrada exitosamente!");
          router.push(`/vendu/dashboard/${result.tenantId}/admin`);
        } else {
          console.log("Registration failed, result:", result);
        }

        // Clear localStorage
        localStorage.removeItem("onboarding-step");
        localStorage.removeItem("onboarding-data");
        localStorage.removeItem("onboarding-credentials");
      } catch (error) {
        console.error("Error completing registration:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al completar el registro. Inténtalo de nuevo.";
        toast.error(errorMessage);
        // Don't redirect on error, let user retry
      }
    }

    setIsLoading(false);
  };

  // Handle going back to previous step
  const handleStepBack = () => {
    const steps = [
      "auth",
      "company-name",
      "owner",
      "branch",
      "warehouse",
      "fiscal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1] as typeof currentStep;
      setCurrentStep(prevStep);
      localStorage.setItem("onboarding-step", prevStep);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LoadingOverlay isVisible={isLoading} text="Guardando información..." />

      {/* ================= LEFT: FORM ================= */}
      <div className="flex items-center justify-center px-6 relative">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Receipt className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg">Vendu</span>
        </div>
        <div
          className={cn(
            "w-full max-w-md rounded-xl border bg-background p-8 shadow-sm flex flex-col gap-6"
          )}
        >
          {/* Show stepper during onboarding */}
          {currentStep !== "auth" && <Stepper currentStep={currentStep} />}

          {currentStep === "auth" ? (
            <Suspense
              fallback={
                <div className="flex justify-center p-4">Cargando...</div>
              }
            >
              <AuthStep onRegistrationSuccess={handleRegistrationSuccess} />
            </Suspense>
          ) : (
            <OnboardingFlow
              currentStep={currentStep}
              onboardingData={onboardingData}
              onStepComplete={handleStepComplete}
              onStepBack={handleStepBack}
              onDataChange={saveOnboardingData}
              tenantId={tenantId}
            />
          )}
        </div>
      </div>

      {/* ================= RIGHT: IMAGE ================= */}
      <div className="hidden lg:block relative bg-muted">
        {/* Image removed for now */}
      </div>
    </div>
  );
}
