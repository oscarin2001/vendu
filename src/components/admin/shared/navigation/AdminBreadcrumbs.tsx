"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebarToolbar } from "../sidebar/context/SidebarToolbarContext";

export function AdminBreadcrumbs() {
  const { breadcrumbs } = useSidebarToolbar();

  // If no breadcrumbs, show default
  const displayBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : ["Panel de Control"];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;

          return (
            <div key={`${crumb}-${index}`} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
