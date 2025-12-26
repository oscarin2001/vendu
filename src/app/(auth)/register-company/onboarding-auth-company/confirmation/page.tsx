import { Confirmation } from "@/components/auth/company/onboarding/Confirmation";

export default function ConfirmationPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">¡Listo!</h2>
      <p className="text-muted-foreground mb-6">
        Revisa y confirma tu configuración.
      </p>
      <Confirmation />
    </div>
  );
}
