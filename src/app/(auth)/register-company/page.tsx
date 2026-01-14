import { Suspense } from "react";
import RegisterCompanyForm from "@/components/auth/company/RegisterCompanyForm";
import { getAuthCookie } from "@/services/auth/adapters";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Vendu | Registro de empresa",
  description: "Crea tu cuenta empresarial en Vendu",
};

export default async function RegisterCompanyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const modeValue = params?.mode;
  const mode = typeof modeValue === "string" ? modeValue : "";

  // If user is already authenticated, redirect them to their dashboard
  const auth = await getAuthCookie();

  if (auth) {
    const isPending = auth.tenantId === "pending-onboarding";

    // Si es pending-onboarding, permitir que el componente cliente maneje el wizard inline
    // Solo redirigir si el usuario ya tiene un slug válido (onboarding completado)
    if (!isPending && mode !== "register" && mode !== "login") {
      redirect(`/vendu/dashboard/${auth.tenantId}/admin`);
    }
    // Si es pending-onboarding, dejamos que el cliente muestre el wizard inline
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
