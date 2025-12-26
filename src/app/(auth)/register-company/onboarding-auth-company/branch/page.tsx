import { BranchForm } from "@/components/auth/company/onboarding/BranchForm";

export default function BranchPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sucursal Principal</h2>
      <p className="text-muted-foreground mb-6">¿Dónde opera tu negocio?</p>
      <BranchForm />
    </div>
  );
}
