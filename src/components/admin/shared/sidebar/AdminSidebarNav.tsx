"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  ChevronDown,
  Truck,
  Warehouse,
  Briefcase,
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
    Operaciones: true, // Default open
    "Recursos Humanos": false,
  });

  const navigationGroups = [
    {
      title: "Principal",
      items: [
        {
          title: "Panel de Control",
          url: tenantId ? `/vendu/dashboard/${tenantId}/admin` : "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Operaciones",
      collapsible: true,
      items: [
        {
          title: "Empresa",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/company`
            : "/admin/company",
        },
        {
          title: "Sucursales",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/branches`
            : "/admin/branches",
        },
        {
          title: "Bodegas",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/warehouses`
            : "/admin/warehouses",
        },
      ],
    },
    {
      title: "Recursos Humanos",
      collapsible: true,
      items: [
        {
          title: "Encargados",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/managers`
            : "/admin/managers",
        },
        {
          title: "Proveedores",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/suppliers`
            : "/admin/suppliers",
        },
      ],
    },
    {
      title: "Sistema",
      collapsible: true,
      items: [
        {
          title: "Configuración",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/settings`
            : "/admin/settings",
        },
        {
          title: "Reportes",
          url: tenantId
            ? `/vendu/dashboard/${tenantId}/admin/reports`
            : "/admin/reports",
        },
      ],
    },
  ];

  // Function to get breadcrumbs based on current pathname
  const getBreadcrumbsForPath = (path: string) => {
    // Extract the last segment of the path (e.g., "company" from "/vendu/dashboard/tenant/admin/company")
    const pathSegments = path.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Find the matching navigation item by URL segment
    for (const group of navigationGroups) {
      for (const item of group.items) {
        // Check if the item URL ends with the last segment
        const itemSegments = item.url.split("/").filter(Boolean);
        const itemLastSegment = itemSegments[itemSegments.length - 1];

        if (lastSegment === itemLastSegment) {
          return {
            title: item.title,
            breadcrumbs:
              group.title === "Principal"
                ? [item.title]
                : [group.title, item.title],
          };
        }
      }
    }
    // Default fallback
    return {
      title: "Panel de Control",
      breadcrumbs: ["Panel de Control"],
    };
  };

  // Update breadcrumbs when pathname changes
  useEffect(() => {
    const { title, breadcrumbs } = getBreadcrumbsForPath(pathname);
    setTitle(title);
    setBreadcrumbs(breadcrumbs);
  }, [pathname, tenantId, setTitle, setBreadcrumbs]);

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
              {group.title === "Principal" || group.title === "Sistema" ? (
                // Principal and Sistema groups - direct items without collapsible
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
                        const crumbs = group.title === "Principal" ? [item.title] : [group.title, item.title];
                        setBreadcrumbs(crumbs);
                        setTitle(item.title);
                      }}
                    >
                      <Link href={item.url}>
                        {group.title === "Principal" && item.icon && <item.icon className="h-4 w-4" />}
                        {group.title === "Sistema" && item.title === "Configuración" && <Settings className="h-4 w-4" />}
                        {group.title === "Sistema" && item.title === "Reportes" && <BarChart3 className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                // Operaciones and Recursos Humanos groups are collapsible
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(group.title)}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        {group.title === "Operaciones" && <Briefcase className="h-4 w-4 mr-2" />}
                        {group.title === "Recursos Humanos" && <Users className="h-4 w-4 mr-2" />}
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
                              const crumbs = [group.title, subItem.title];
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
