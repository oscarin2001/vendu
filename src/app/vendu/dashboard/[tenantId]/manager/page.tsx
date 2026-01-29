import { getManagerAuthCookie } from "@/services/manager/auth/server";
import { redirect } from "next/navigation";
import { ManagerDashboardContent } from "./components/ManagerDashboardContent";

interface ManagerPageProps {
  params: Promise<{ tenantId: string }>;
}

export default async function ManagerDashboardPage({ params }: ManagerPageProps) {
  const { tenantId } = await params;
  const auth = await getManagerAuthCookie();

  if (!auth) {
    redirect("/auth/manager/login");
  }

  if (auth.tenantId !== tenantId) {
    redirect(`/vendu/dashboard/${auth.tenantId}/manager`);
  }

  return (
    <ManagerDashboardContent 
      tenantId={tenantId}
      managerName={`${auth.firstName} ${auth.lastName}`}
    />
  );
}
