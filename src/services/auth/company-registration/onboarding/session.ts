// TODO: Implement session storage for onboarding data
// Using localStorage for client-side

import { OnboardingData } from "./types";

const SESSION_KEY = "onboarding-data";

export function saveOnboardingData(data: Partial<OnboardingData>) {
  if (typeof window !== "undefined") {
    const existing = getOnboardingData();
    const updated = { ...existing, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
}

export function getOnboardingData(): Partial<OnboardingData> {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : {};
  }
  return {};
}

export function clearOnboardingData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
