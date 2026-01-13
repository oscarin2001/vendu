import { LayoutDashboard } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon?: any;
}

export interface NavigationGroup {
  title: string;
  collapsible?: boolean;
  items: NavigationItem[];
}

export function getNavigationConfig(tenantId?: string): NavigationGroup[] {
  const baseUrl = tenantId ? `/vendu/dashboard/${tenantId}/admin` : "/admin";

  return [
    {
      title: "Principal",
      items: [
        { title: "Panel de Control", url: baseUrl, icon: LayoutDashboard },
      ],
    },
    {
      title: "Estratégico",
      items: [
        { title: "Empresa", url: `${baseUrl}/company` },
        { title: "Inventario Estratégico", url: `${baseUrl}/inventory` },
      ],
    },
    {
      title: "Operaciones",
      collapsible: true,
      items: [
        { title: "Ventas", url: `${baseUrl}/sales` },
        { title: "Clientes", url: `${baseUrl}/customers` },
        { title: "CRM", url: `${baseUrl}/crm` },
      ],
    },
    {
      title: "Logística",
      collapsible: true,
      items: [
        { title: "Proveedores", url: `${baseUrl}/suppliers` },
        { title: "Bodegas", url: `${baseUrl}/warehouses` },
        { title: "Sucursales", url: `${baseUrl}/branches` },
      ],
    },
    {
      title: "Recursos Humanos",
      collapsible: true,
      items: [
        { title: "Empleados", url: `${baseUrl}/employees` },
        { title: "Jurado", url: `${baseUrl}/jurado` },
      ],
    },
    {
      title: "Sistema",
      collapsible: true,
      items: [{ title: "Reportes", url: `${baseUrl}/reports` }],
    },
  ];
}
