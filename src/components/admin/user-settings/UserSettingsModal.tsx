"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserSettingsModalProps } from "./types";
import { AccountTab } from "./components/AccountTab";
import { SystemTab } from "./components/SystemTab";
import { NotificationsTab } from "./components/NotificationsTab";
import { CompanyTab } from "./components/CompanyTab";
import { User, Bell, Building2, Settings, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "account",
    label: "Cuenta",
    component: AccountTab,
    icon: User,
    color: "text-blue-600",
    description: "Perfil y datos personales",
  },
  {
    id: "notifications",
    label: "Notificaciones",
    component: NotificationsTab,
    icon: Bell,
    color: "text-orange-600",
    description: "Preferencias de comunicación",
  },
  {
    id: "company",
    label: "Empresa",
    component: CompanyTab,
    icon: Building2,
    color: "text-green-600",
    description: "Información empresarial",
  },
  {
    id: "system",
    label: "Sistema",
    component: SystemTab,
    icon: Settings,
    color: "text-purple-600",
    description: "Configuración general",
  },
];

export function UserSettingsModal({
  isOpen,
  onClose,
  userId,
}: UserSettingsModalProps) {
  const defaultTab = tabs[0]?.id ?? "account";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component ??
    tabs.find((tab) => tab.id === defaultTab)?.component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-[680px] h-[85vh] max-h-[600px] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header compacto */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              Configuraciones
            </DialogTitle>
            <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
              {tabs.find((tab) => tab.id === activeTab)?.label || "General"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Body: Sidebar + Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar compacto */}
          <nav className="w-[140px] shrink-0 border-r bg-muted/20 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-primary-foreground" : tab.color
                    )}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Contenido scrollable */}
          <div className="flex-1 min-w-0 overflow-y-auto p-6">
            {ActiveComponent && <ActiveComponent userId={userId} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
