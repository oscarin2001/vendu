"use client";

import { AnimatedTransition } from "@/components/ui/animations";
import { CompanyStep, DetailsStep, OwnerStep, FiscalStep, ConfirmStep } from "./onboarding/steps";

type StepType = "company" | "details" | "owner" | "fiscal" | "confirm";

interface OnboardingFlowProps {
  currentStep: StepType;
  onboardingData: {
    companyName: {
      name: string;
      country: string;
      phone: string;
      department?: string;
      commerceType?: string;
      description?: string;
      openedAt?: string;
    };
    owner: {
      firstName: string;
      lastName: string;
      phone: string;
      ci: string;
      gender: string;
      birthDate?: string;
    };
    fiscal: {
      taxId?: string;
      businessName?: string;
      fiscalAddress?: string;
    };
  };
  onStepComplete: (step: string, data: any) => void;
  onDataChange?: (data: any) => void;
  onStepBack?: () => void;
}

export function OnboardingFlow({
  currentStep,
  onboardingData,
  onStepComplete,
  onDataChange,
  onStepBack,
}: OnboardingFlowProps) {
  return (
    <>
      {currentStep === "company" && (
        <AnimatedTransition show={currentStep === "company"} direction="right">
          <CompanyStep
            initialData={onboardingData.companyName}
            onDataChange={(data) => onDataChange?.({ companyName: { ...onboardingData.companyName, ...data } })}
            onNext={() => onStepComplete("company", onboardingData.companyName)}
          />
        </AnimatedTransition>
      )}

      {currentStep === "details" && (
        <AnimatedTransition show={currentStep === "details"} direction="right">
          <DetailsStep
            initialData={onboardingData.companyName}
            companyCountry={onboardingData.companyName.country}
            onDataChange={(data) => onDataChange?.({ companyName: { ...onboardingData.companyName, ...data } })}
            onNext={() => onStepComplete("details", onboardingData.companyName)}
            onBack={onStepBack}
          />
        </AnimatedTransition>
      )}

      {currentStep === "owner" && (
        <AnimatedTransition show={currentStep === "owner"} direction="right">
          <OwnerStep
            initialData={onboardingData.owner}
            companyCountry={onboardingData.companyName.country}
            onDataChange={(data) => onDataChange?.({ owner: data })}
            onNext={() => onStepComplete("owner", onboardingData.owner)}
            onBack={onStepBack}
          />
        </AnimatedTransition>
      )}

      {currentStep === "fiscal" && (
        <AnimatedTransition show={currentStep === "fiscal"} direction="right">
          <FiscalStep
            initialData={onboardingData.fiscal}
            onDataChange={(data) => onDataChange?.({ fiscal: data })}
            onNext={() => onStepComplete("fiscal", onboardingData.fiscal)}
            onBack={onStepBack}
          />
        </AnimatedTransition>
      )}

      {currentStep === "confirm" && (
        <AnimatedTransition show={currentStep === "confirm"} direction="up">
          <ConfirmStep data={onboardingData} onBack={onStepBack} />
        </AnimatedTransition>
      )}
    </>
  );
}