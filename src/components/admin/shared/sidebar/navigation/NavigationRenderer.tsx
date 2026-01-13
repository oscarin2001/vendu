"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Building2,
  MapPin,
  Users,
  UserCheck,
  BarChart3,
  TrendingUp,
  Truck,
  Warehouse,
  Package,
  LayoutDashboard,
} from "lucide-react";

interface NavigationItem {
  title: string;
  url: string;
  icon?: any;
}

interface NavigationGroup {
  title: string;
  collapsible?: boolean;
  items: NavigationItem[];
}

interface NavigationRendererProps {
  groups: NavigationGroup[];
  openGroups: Record<string, boolean>;
  onToggleGroup: (group: string) => void;
}

const iconMap: Record<string, any> = {
  "Panel de Control": LayoutDashboard,
  Empresa: Building2,
  "Inventario Estratégico": Package,
  Ventas: TrendingUp,
  Clientes: Users,
  CRM: UserCheck,
  Proveedores: Truck,
  Bodegas: Warehouse,
  Sucursales: MapPin,
  Empleados: Users,
  Jurado: UserCheck,
  Reportes: BarChart3,
};

export function NavigationRenderer({
  groups,
  openGroups,
  onToggleGroup,
}: NavigationRendererProps) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel
            onClick={() => group.collapsible && onToggleGroup(group.title)}
            className={cn(
              group.collapsible && "cursor-pointer hover:bg-muted/50"
            )}
          >
            {group.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(!group.collapsible || openGroups[group.title]) &&
                group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {(() => {
                          const Icon = item.icon || iconMap[item.title];
                          return Icon ? <Icon className="h-4 w-4" /> : null;
                        })()}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
