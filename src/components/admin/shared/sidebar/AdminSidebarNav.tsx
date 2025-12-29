"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useSidebarToolbar } from "./SidebarToolbarContext";

export function AdminSidebarNav({ tenantId }: { tenantId?: string }) {
  const pathname = usePathname();
  const { setTitle, setBreadcrumbs } = useSidebarToolbar();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Personal: true, // Default open
  });

  const navigationGroups = [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin` : "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Gestión",
      items: [
        {
          title: "Empresa",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/company` : "/admin/company",
          icon: Building2,
        },
        {
          title: "Sucursales",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/branches` : "/admin/branches",
          icon: MapPin,
        },
      ],
    },
    {
      title: "Equipo",
      collapsible: true,
      items: [
        {
          title: "Encargados",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/managers` : "/admin/managers",
          icon: Users,
        },
        {
          title: "Empleados",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/employees` : "/admin/employees",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/settings` : "/admin/settings",
          icon: Settings,
        },
        {
          title: "Reportes",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin/reports` : "/admin/reports",
          icon: BarChart3,
        },
      ],
    },
  ];

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <nav className="flex-1 px-3 py-4">
      {navigationGroups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!group.collapsible &&
                group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url === "/admin"
                          ? pathname === item.url
                          : pathname.startsWith(item.url)
                      }
                      onClick={() => {
                        const crumbs = [item.title];
                        setBreadcrumbs(crumbs);
                        setTitle(item.title);
                      }}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              {group.collapsible && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(group.title)}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {group.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openGroups[group.title] ? "rotate-180" : ""
                        )}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {openGroups[group.title] && (
                    <SidebarMenuSub>
                      {group.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(subItem.url)}
                            onClick={() => {
                              const crumbs = [subItem.title];
                              setBreadcrumbs(crumbs);
                              setTitle(subItem.title);
                            }}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </nav>
  );
}
