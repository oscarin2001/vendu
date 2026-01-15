"use client";

import { useState } from "react";
import { ProgressBar } from "./shared/ProgressBar";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";

interface OnboardingWizardProps {
  onComplete?: (data: any) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    country: "",
    phone: "",
    department: "",
    commerceType: "",
    openedAt: "",
  });

  const steps = [
    <Step1
      key={0}
      data={data}
      setData={setData}
      onNext={() => setCurrentStep(1)}
    />,
    <Step2
      key={1}
      data={data}
      setData={setData}
      onNext={() => setCurrentStep(2)}
      onBack={() => setCurrentStep(0)}
    />,
    <Step3
      key={2}
      data={data}
      setData={setData}
      onSubmit={() => onComplete?.(data)}
      onBack={() => setCurrentStep(1)}
    />,
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar current={currentStep} total={3} />
      {steps[currentStep]}
    </div>
  );
}
