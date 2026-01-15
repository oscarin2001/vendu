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
      <DialogContent className="max-w-[1800px] max-h-[95vh] min-h-[72vh] w-[95vw] min-w-[1100px] overflow-hidden">
        <DialogHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-foreground" />
                Configuraciones
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Personaliza tu experiencia y preferencias del sistema
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex text-xs px-3 py-1">
              {tabs.find((tab) => tab.id === activeTab)?.label || "General"}
            </Badge>
          </div>
        </DialogHeader>
        <div className="flex h-full min-h-0 gap-4 overflow-hidden">
          {/* Sidebar interno mejorado */}
          <div className="w-36 sm:w-44 border-r bg-muted/20 py-4 pl-2 pr-3">
            <div className="h-full">
              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center justify-start gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group hover:scale-[1.02]",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="text-left flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", tab.color)} />
                        <span className="font-medium whitespace-nowrap">
                          {tab.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* Contenido */}
          <div className="flex-1 min-w-0 overflow-hidden bg-card">
            <div className="h-full overflow-y-auto max-h-[calc(95vh-8rem)] p-6">
              {ActiveComponent && <ActiveComponent userId={userId} />}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
