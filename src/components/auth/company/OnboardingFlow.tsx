"use client";

import { AnimatedTransition } from "@/components/ui/animations";

// Onboarding components
import { CompanyForm } from "./onboarding/CompanyForm";
import { CompanyDescriptionForm } from "./onboarding/CompanyDescriptionForm";
import { OwnerForm } from "./forms/onboarding/owner/OwnerForm";
import { FiscalForm } from "./onboarding/FiscalForm";
import { Confirmation } from "./onboarding/Confirmation";
import { LegalStep } from "./onboarding/LegalStep";

interface OnboardingFlowProps {
  currentStep: "company-name" | "company-details" | "owner" | "fiscal" | "legal" | "confirmation";
  onboardingData: {
    companyName: {
      name: string;
      country: string;
      phone: string;
      department?: string;
      commerceType?: string;
      description?: string;
      vision?: string;
      mission?: string;
      openedAt?: string;
    };
    owner: {
      firstName: string;
      lastName: string;
      phone: string;
      ci: string;
      gender: string;
    };
    fiscal: { taxId: string; businessName: string; fiscalAddress: string };
    legal: { tosAccepted: boolean; tosRead: boolean };
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
    "company-details": onboardingData.companyName,
    owner: onboardingData.owner,
    fiscal: onboardingData.fiscal,
    legal: onboardingData.legal,
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
          <CompanyForm
            initialData={onboardingData.companyName}
            onDataChange={(data) => onDataChange?.({ companyName: data })}
            onBack={onStepBack}
            onNext={() => handleStepNext("company-name")}
          />
        </AnimatedTransition>
      )}

      {currentStep === "company-details" && (
        <AnimatedTransition
          show={currentStep === "company-details"}
          direction="right"
        >
          <CompanyDescriptionForm
            initialData={{
              description: onboardingData.companyName.description,
              vision: onboardingData.companyName.vision,
              mission: onboardingData.companyName.mission,
            }}
            onBack={onStepBack}
            onDataChange={(data) =>
              onDataChange?.({
                companyName: { ...onboardingData.companyName, ...data },
              })
            }
            onNext={() => handleStepNext("company-details")}
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

      {currentStep === "legal" && (
        <AnimatedTransition show={currentStep === "legal"} direction="right">
          <LegalStep
            companyData={onboardingData.companyName}
            initialData={onboardingData.legal}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange?.({ legal: data })}
            onNext={() => handleStepNext("legal")}
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
