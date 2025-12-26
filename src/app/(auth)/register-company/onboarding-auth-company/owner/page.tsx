import { OwnerForm } from "@/components/auth/company/onboarding/OwnerForm";

export default function OwnerPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Responsable de la Empresa</h2>
      <p className="text-muted-foreground mb-6">¿Quién maneja la empresa?</p>
      <OwnerForm />
    </div>
  );
}
