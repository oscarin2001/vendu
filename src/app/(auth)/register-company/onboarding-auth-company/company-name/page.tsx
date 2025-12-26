import { CompanyNameForm } from "@/components/auth/company/onboarding/CompanyNameForm";

export default function CompanyNamePage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Identidad de la Empresa</h2>
      <p className="text-muted-foreground mb-6">
        ¿Cómo se llama tu empresa u organización?
      </p>
      <CompanyNameForm />
    </div>
  );
}
