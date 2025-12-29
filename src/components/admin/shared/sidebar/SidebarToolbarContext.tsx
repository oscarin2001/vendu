"use client";

import * as React from "react";

type ToolbarState = {
  title: string;
  breadcrumbs: string[];
  setTitle: (t: string) => void;
  setBreadcrumbs: (b: string[]) => void;
};

const SidebarToolbarContext = React.createContext<ToolbarState | null>(null);

export function SidebarToolbarProvider({
  children,
  defaultTitle = "Dashboard",
}: {
  children: React.ReactNode;
  defaultTitle?: string;
}) {
  const [title, setTitle] = React.useState(defaultTitle);
  const [breadcrumbs, setBreadcrumbs] = React.useState<string[]>([
    defaultTitle,
  ]);

  const value = React.useMemo(
    () => ({ title, breadcrumbs, setTitle, setBreadcrumbs }),
    [title, breadcrumbs]
  );

  React.useEffect(() => {
    console.log("[SidebarToolbarProvider] mounted", { title, breadcrumbs });
    return () => console.log("[SidebarToolbarProvider] unmounted");
  }, []);

  return (
    <SidebarToolbarContext.Provider value={value}>
      {children}
    </SidebarToolbarContext.Provider>
  );
}

export function useSidebarToolbar() {
  const ctx = React.useContext(SidebarToolbarContext);
  if (!ctx) {
    // Return a safe fallback so components using the hook won't crash
    return {
      title: "Dashboard",
      breadcrumbs: ["Dashboard"],
      setTitle: () => {},
      setBreadcrumbs: () => {},
    } as ToolbarState;
  }

  return ctx;
}

export default SidebarToolbarContext;
