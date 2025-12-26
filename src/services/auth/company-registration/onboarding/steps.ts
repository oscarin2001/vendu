import { ONBOARDING_STEPS, OnboardingStep } from "./constants";

export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  if (currentIndex < ONBOARDING_STEPS.length - 1) {
    return ONBOARDING_STEPS[currentIndex + 1];
  }
  return null;
}

export function getPrevStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
  if (currentIndex > 0) {
    return ONBOARDING_STEPS[currentIndex - 1];
  }
  return null;
}

export function isValidStep(step: string): step is OnboardingStep {
  return ONBOARDING_STEPS.includes(step as OnboardingStep);
}