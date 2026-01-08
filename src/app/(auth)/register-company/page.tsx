import { Suspense } from "react";
import RegisterCompanyForm from "@/components/auth/company/RegisterCompanyForm";
import { getAuthCookie } from "@/services/auth/adapters";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Vendu | Registro de empresa",
  description: "Crea tu cuenta empresarial en Vendu",
};

export default async function RegisterCompanyPage() {
  // If user is already authenticated, redirect them to their dashboard
  const auth = await getAuthCookie();
  if (auth) {
    redirect(`/vendu/dashboard/${auth.tenantId}/admin`);
  }

  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-sm text-white/60">
          Verificando sesión...
        </div>
      }
    >
      <RegisterCompanyForm />
    </Suspense>
  );
}
