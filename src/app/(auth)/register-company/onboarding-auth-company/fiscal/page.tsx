import { FiscalForm } from "@/components/auth/company/onboarding/FiscalForm";

export default function FiscalPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Datos Fiscales</h2>
      <p className="text-muted-foreground mb-6">
        Información fiscal (opcional)
      </p>
      <FiscalForm />
    </div>
  );
}
