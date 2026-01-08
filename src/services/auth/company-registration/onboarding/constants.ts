export const ONBOARDING_STEPS = [
  "company-name",
  "company-details",
  "owner",
  "branch",
  "warehouse",
  "fiscal",
  "confirmation",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const COUNTRIES = [
  "Bolivia",
  "Honduras",
  "Guatemala",
  "Nicaragua",
  "Perú",
  "Ecuador",
];

// Commerce types used by onboarding company form
export const COMMERCE_TYPES = [
  "Moda",
  "Repuestos",
  "Electrónica de celulares",
  "Repuestos de autos",
  "Accesorios",
  "Alimentos",
  "Otro (requiere aprobación)",
];
