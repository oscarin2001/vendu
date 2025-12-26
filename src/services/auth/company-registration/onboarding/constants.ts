export const ONBOARDING_STEPS = [
  "company-name",
  "owner",
  "branch",
  "warehouse",
  "fiscal",
  "confirmation",
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];

export const COUNTRIES = [
  "Bolivia",
  "Argentina",
  "Chile",
  "Perú",
  "Colombia",
  // Add more as needed
];