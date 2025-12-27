"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  // Extraer la parte después de /admin
  const pathSegments = pathname.split("/").filter(Boolean);
  const adminIndex = pathSegments.indexOf("admin");

  if (adminIndex === -1) return null;

  const breadcrumbs = pathSegments.slice(adminIndex + 1);

  // Mapear rutas a títulos legibles
  const routeTitles: Record<string, string> = {
    "": "Dashboard",
    users: "Usuarios",
    settings: "Configuración",
    reports: "Reportes",
    billing: "Facturación",
    managers: "Gerentes de Sucursal",
    // Agregar más según se expandan las rutas
  };

  const breadcrumbItems = breadcrumbs.map((segment, index) => {
    const title = routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const href = `/${pathSegments.slice(0, adminIndex + 1 + index + 1).join("/")}`;
    const isLast = index === breadcrumbs.length - 1;

    return (
      <BreadcrumbItem key={segment}>
        {isLast ? (
          <BreadcrumbPage>{title}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });

  if (breadcrumbItems.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${pathSegments.slice(0, adminIndex + 1).join("/")}`}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator />
            {item}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}