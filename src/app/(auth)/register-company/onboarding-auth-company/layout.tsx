import { ReactNode } from "react";
import { Stepper } from "@/components/auth/company/onboarding/Stepper";

interface LayoutProps {
  children: ReactNode;
}

export default function OnboardingAuthCompanyLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Stepper />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
