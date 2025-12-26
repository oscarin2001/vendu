"use client";

import { AnimatedTransition } from "@/components/ui/animations";

// Onboarding components
import { CompanyNameForm } from "./onboarding/CompanyNameForm";
import { OwnerForm } from "./onboarding/OwnerForm";
import { BranchForm } from "./onboarding/BranchForm";
import { WarehouseForm } from "./onboarding/WarehouseForm";
import { FiscalForm } from "./onboarding/FiscalForm";
import { Confirmation } from "./onboarding/Confirmation";

interface OnboardingFlowProps {
  currentStep:
    | "company-name"
    | "owner"
    | "branch"
    | "warehouse"
    | "fiscal"
    | "confirmation";
  onboardingData: {
    companyName: { name: string; country: string; phone: string };
    owner: {
      firstName: string;
      lastName: string;
      phone: string;
      ci: string;
      gender: string;
    };
    branch: {
      name: string;
      address: string;
      city: string;
      department: string;
      country: string;
      phone: string;
      isWarehouse: boolean;
    };
    warehouse: {
      hasWarehouse: boolean;
      name: string;
      address: string;
      city: string;
      department: string;
      country: string;
      phone: string;
    };
    fiscal: { taxId: string; businessName: string; fiscalAddress: string };
  };
  onStepComplete: (step: string, data: any) => void;
  onStepBack: () => void;
  onDataChange: (data: Partial<OnboardingFlowProps["onboardingData"]>) => void;
}

export function OnboardingFlow({
  currentStep,
  onboardingData,
  onStepComplete,
  onStepBack,
  onDataChange,
}: OnboardingFlowProps) {
  return (
    <>
      {currentStep === "company-name" && (
        <AnimatedTransition
          show={currentStep === "company-name"}
          direction="right"
        >
          <CompanyNameForm
            initialData={onboardingData.companyName}
            onComplete={(data: any) => onStepComplete("companyName", data)}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange({ companyName: data })}
          />
        </AnimatedTransition>
      )}

      {currentStep === "owner" && (
        <AnimatedTransition show={currentStep === "owner"} direction="right">
          <OwnerForm
            initialData={onboardingData.owner}
            onComplete={(data: any) => onStepComplete("owner", data)}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange({ owner: data })}
          />
        </AnimatedTransition>
      )}

      {currentStep === "branch" && (
        <AnimatedTransition show={currentStep === "branch"} direction="right">
          <BranchForm
            initialData={onboardingData.branch}
            onComplete={(data: any) => onStepComplete("branch", data)}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange({ branch: data })}
          />
        </AnimatedTransition>
      )}

      {currentStep === "warehouse" && (
        <AnimatedTransition
          show={currentStep === "warehouse"}
          direction="right"
        >
          <WarehouseForm
            initialData={onboardingData.warehouse}
            onComplete={(data: any) => onStepComplete("warehouse", data)}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange({ warehouse: data })}
          />
        </AnimatedTransition>
      )}

      {currentStep === "fiscal" && (
        <AnimatedTransition show={currentStep === "fiscal"} direction="right">
          <FiscalForm
            initialData={onboardingData.fiscal}
            onComplete={(data: any) => onStepComplete("fiscal", data)}
            onBack={onStepBack}
            onDataChange={(data) => onDataChange({ fiscal: data })}
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
          />
        </AnimatedTransition>
      )}
    </>
  );
}
