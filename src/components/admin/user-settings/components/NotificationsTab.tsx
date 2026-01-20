"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Mail,
  Smartphone,
  MessageSquare,
  Package,
  AlertTriangle,
  Settings,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationsTabProps {
  userId: number;
}

export function NotificationsTab({ userId }: NotificationsTabProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    inventoryAlerts: true,
    systemAlerts: true,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    channels: false,
    types: false,
  });

  useEffect(() => {
    // Simulate loading notifications settings
    const loadSettings = async () => {
      try {
        // TODO: Load from API
        setTimeout(() => {
          setSettings({
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            orderUpdates: true,
            inventoryAlerts: true,
            systemAlerts: true,
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        toast.error("Error cargando configuraciones de notificaciones");
        setLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Configuraciones de notificaciones guardadas");
    } catch (error) {
      toast.error("Error guardando configuraciones");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Notificaciones</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">Notificaciones</h3>
      </div>

      {/* Canales de Notificación - Card */}
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          onClick={() => setExpanded((s) => ({ ...s, channels: !s.channels }))}
          className="w-full flex items-center justify-between p-3 bg-transparent hover:bg-muted/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Canales de Comunicación</div>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded.channels ? "rotate-180" : ""
            )}
          />
        </button>

        {expanded.channels && (
          <div className="p-4 space-y-3">
            <div className="grid gap-3">
              {/** Email */}
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Notificaciones por Email</div>
                    <div className="text-sm text-muted-foreground">
                      Recibe actualizaciones importantes por correo electrónico
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      emailNotifications: checked as boolean,
                    }))
                  }
                />
              </div>

              {/** Push */}
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Notificaciones Push</div>
                    <div className="text-sm text-muted-foreground">
                      Alertas instantáneas en tu navegador y dispositivos
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      pushNotifications: checked as boolean,
                    }))
                  }
                />
              </div>

              {/** SMS */}
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Notificaciones SMS</div>
                    <div className="text-sm text-muted-foreground">
                      Mensajes de texto para notificaciones críticas
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      smsNotifications: checked as boolean,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tipos de Notificación - Card */}
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          onClick={() => setExpanded((s) => ({ ...s, types: !s.types }))}
          className="w-full flex items-center justify-between p-3 bg-transparent hover:bg-muted/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Tipos de Notificaciones</div>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded.types ? "rotate-180" : ""
            )}
          />
        </button>

        {expanded.types && (
          <div className="p-4 space-y-3">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      Actualizaciones de Pedidos
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cambios en el estado de tus pedidos
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      orderUpdates: checked as boolean,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">Alertas de Inventario</div>
                    <div className="text-sm text-muted-foreground">
                      Productos con stock bajo o agotado
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.inventoryAlerts}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      inventoryAlerts: checked as boolean,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Settings className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">Alertas del Sistema</div>
                    <div className="text-sm text-muted-foreground">
                      Mantenimiento, actualizaciones y errores del sistema
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      systemAlerts: checked as boolean,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="pt-6 border-t flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          Última actualización: hace 3 días
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Restablecer
          </Button>
          <Button size="sm" className="min-w-[140px]">
            {saving ? "Guardando..." : "Guardar Preferencias"}
          </Button>
        </div>
      </div>
    </div>
  );
}
