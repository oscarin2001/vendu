import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Portal de Encargados",
  description: "Panel de control para encargados",
};

export default function ManagerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
