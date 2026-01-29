import { ManagerAuthShell, ManagerLoginHeader, ManagerLoginForm } from "@/components/manager/auth";

export default function ManagerLoginPage() {
  return (
    <ManagerAuthShell>
      <ManagerLoginHeader />
      <ManagerLoginForm />
    </ManagerAuthShell>
  );
}
