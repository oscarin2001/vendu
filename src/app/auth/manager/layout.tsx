import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Portal de Encargados",
  description: "Accede al portal de gestión para encargados",
};

export default function ManagerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
