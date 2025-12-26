"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/ui/loading";
import { Stepper } from "./onboarding/Stepper";
import { AuthStep } from "./AuthStep";
import { OnboardingFlow } from "./OnboardingFlow";

export default function AuthForm() {
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
        toast.info("¡Bienvenido de vuelta! Continuemos con el registro de tu empresa.", {
          description: `Continuando desde el paso: ${getStepLabel(savedStep)}`,
        });
      }, 1000);
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setOnboardingData(parsedData);
      } catch (error) {
        console.error("Error parsing saved onboarding data:", error);
        toast.error("Error al cargar datos guardados. Comenzaremos desde el inicio.");
        // Clear corrupted data
        localStorage.removeItem("onboarding-step");
        localStorage.removeItem("onboarding-data");
      }
    }
  }, []);

  // Helper function to get step labels
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      "company-name": "Nombre de la empresa",
      "owner": "Información del propietario",
      "branch": "Sucursal principal",
      "warehouse": "Bodega",
      "fiscal": "Información fiscal",
      "confirmation": "Confirmación",
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
        // TODO: Call completeCompanyRegistrationAction
        console.log("Registration complete");

        // Clear localStorage
        localStorage.removeItem("onboarding-step");
        localStorage.removeItem("onboarding-data");

        // TODO: Redirect to dashboard
      } catch (error) {
        console.error("Error completing registration:", error);
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
      <div className="flex items-center justify-center px-6">
        <div
          className={cn(
            "w-full max-w-md rounded-xl border bg-background p-8 shadow-sm flex flex-col gap-6"
          )}
        >
          {/* Show stepper during onboarding */}
          {currentStep !== "auth" && <Stepper currentStep={currentStep} />}

          {currentStep === "auth" ? (
            <AuthStep onRegistrationSuccess={handleRegistrationSuccess} />
          ) : (
            <OnboardingFlow
              currentStep={currentStep}
              onboardingData={onboardingData}
              onStepComplete={handleStepComplete}
              onStepBack={handleStepBack}
              onDataChange={saveOnboardingData}
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
