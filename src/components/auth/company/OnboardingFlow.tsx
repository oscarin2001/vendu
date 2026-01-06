"use client";

import { AnimatedTransition } from "@/components/ui/animations";

// Onboarding components
import { CompanyNameForm } from "./onboarding/CompanyNameForm";
import { OwnerForm } from "./forms/onboarding/owner";
import { FiscalForm } from "./onboarding/FiscalForm";
import { Confirmation } from "./onboarding/Confirmation";

interface OnboardingFlowProps {
  currentStep: "company-name" | "owner" | "fiscal" | "confirmation";
  onboardingData: {
    companyName: { name: string; country: string; phone: string };
    owner: {
      firstName: string;
      lastName: string;
      phone: string;
      ci: string;
      gender: string;
    };
    fiscal: { taxId: string; businessName: string; fiscalAddress: string };
  };
  onStepComplete: (step: string, data: any) => void;
  onBack?: () => void;
  onDataChange?: (data: any) => void;
  onStepBack?: () => void;
  tenantId?: string;
}

export function OnboardingFlow({
  currentStep,
  onboardingData,
  onStepComplete,
  onBack,
  onDataChange,
  onStepBack,
  tenantId,
}: OnboardingFlowProps) {
  const stepPayloads = {
    "company-name": onboardingData.companyName,
    owner: onboardingData.owner,
    fiscal: onboardingData.fiscal,
  } as const;

  const handleStepNext = (step: keyof typeof stepPayloads) => {
    onStepComplete(step, stepPayloads[step]);
  };

  return (
    <>
      {currentStep === "company-name" && (
        <AnimatedTransition
          show={currentStep === "company-name"}
          direction="right"
        >
          <CompanyNameForm
            initialData={onboardingData.companyName}
            onDataChange={(data) => onDataChange?.({ companyName: data })}
            onNext={() => handleStepNext("company-name")}
          />
        </AnimatedTransition>
      )}

      {currentStep === "owner" && (
        <AnimatedTransition show={currentStep === "owner"} direction="right">
          <OwnerForm
            initialData={onboardingData.owner}
            onBack={onStepBack}
            onDataChange={
              onDataChange ? (data) => onDataChange({ owner: data }) : undefined
            }
            onNext={() => handleStepNext("owner")}
          />
        </AnimatedTransition>
      )}

      {currentStep === "fiscal" && (
        <AnimatedTransition show={currentStep === "fiscal"} direction="right">
          <FiscalForm
            initialData={onboardingData.fiscal}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange?.({ fiscal: data })}
            onNext={() => handleStepNext("fiscal")}
          />
        </AnimatedTransition>
      )}

      {currentStep === "confirmation" && (
        <AnimatedTransition
          show={currentStep === "confirmation"}
          direction="up"
        >
          <Confirmation
            data={onboardingData}
            onComplete={() => onStepComplete("confirmation", {})}
            onBack={onStepBack}
            tenantId={tenantId}
          />
        </AnimatedTransition>
      )}
    </>
  );
}
