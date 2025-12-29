"use client";

import { usePathname } from "next/navigation";
import {
  Building2,
  User,
  MapPin,
  Warehouse,
  FileText,
  CheckCircle,
} from "lucide-react";

const steps = [
  { name: "Empresa", path: "company-name", icon: Building2 },
  { name: "Responsable", path: "owner", icon: User },
  { name: "Sucursal", path: "branch", icon: MapPin },
  { name: "Bodega", path: "warehouse", icon: Warehouse },
  { name: "Fiscal", path: "fiscal", icon: FileText },
  { name: "Confirmación", path: "confirmation", icon: CheckCircle },
];

export function Stepper({ currentStep }: { currentStep?: string }) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.path === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="flex items-center justify-center mb-8 px-4">
      <div className="flex items-center space-x-4 overflow-x-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.name} className="flex items-center min-w-max">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-700 text-white shadow-lg"
                      : isCurrent
                      ? "bg-emerald-500 text-white shadow-lg animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? "bg-emerald-700" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
