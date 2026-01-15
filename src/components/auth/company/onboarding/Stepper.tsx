"use client";

import { useRef, useState, useEffect } from "react";
import {
  Building2,
  User,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const steps = [
  { name: "Empresa", path: "company", icon: Building2 },
  { name: "Detalles", path: "details", icon: FileText },
  { name: "Responsable", path: "owner", icon: User },
  { name: "Fiscal", path: "fiscal", icon: FileText },
  { name: "Confirmar", path: "confirm", icon: CheckCircle },
];

export function Stepper({ currentStep }: { currentStep?: string }) {
  const getCurrentStepIndex = () => steps.findIndex((s) => s.path === currentStep);
  const currentIndex = getCurrentStepIndex();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    // ensure current step is visible and roughly centered in the scroll window
    const el = itemRefs.current[currentIndex];
    const container = containerRef.current;
    if (el && container) {
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const scrollTo = Math.max(0, elCenter - container.clientWidth / 2);
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [currentIndex]);

  const scrollBy = (dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.6;
    container.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center mb-6 px-2">
      <div className="relative w-full max-w-3xl flex items-center">
        <button
          aria-hidden={!canScrollLeft}
          onClick={() => scrollBy("left")}
          className={`hidden sm:inline-flex items-center justify-center p-2 rounded-md mr-2 transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
          }`}
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={containerRef}
          className="stepper-window flex gap-3 sm:gap-6 items-center overflow-x-auto no-scrollbar scroll-smooth px-2 py-1"
          role="list"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div
                key={step.name}
                ref={(r) => { itemRefs.current[index] = r; }}
                role="listitem"
                className="flex items-center min-w-[92px] sm:min-w-[120px]"
              >
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted
                        ? "bg-emerald-700 text-white shadow"
                        : isCurrent
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`mt-1 text-xs sm:text-sm font-medium ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-0 w-8 h-[2px] mx-2 ${isCompleted ? "bg-emerald-700" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>

        <button
          aria-hidden={!canScrollRight}
          onClick={() => scrollBy("right")}
          className={`hidden sm:inline-flex items-center justify-center p-2 rounded-md ml-2 transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-30 pointer-events-none"
          }`}
          aria-label="Siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; height: 0; }
        .stepper-window { scroll-snap-type: x mandatory; }
        .stepper-window > div { scroll-snap-align: center; }
      `}</style>
    </div>
  );
}

