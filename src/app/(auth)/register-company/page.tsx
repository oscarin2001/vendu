import { Suspense } from "react";
import RegisterCompanyForm from "@/components/auth/company/RegisterCompanyForm";

export const metadata = {
  title: "Vendu | Registro de empresa",
  description: "Crea tu cuenta empresarial en Vendu",
};

export default function RegisterCompanyPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-sm text-white/60">Cargando...</div>
      }
    >
      <RegisterCompanyForm />
    </Suspense>
  );
}
