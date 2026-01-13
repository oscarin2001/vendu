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
} from "lucide-react";

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
        <p className="text-muted-foreground mt-1">
          Configura cómo y cuándo quieres recibir notificaciones
        </p>
      </div>

      {/* Canales de Notificación */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Canales de Comunicación
        </h4>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Notificaciones por Email</h4>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones importantes por correo electrónico
                </p>
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

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Notificaciones Push</h4>
                <p className="text-sm text-muted-foreground">
                  Alertas instantáneas en tu navegador y dispositivos
                </p>
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

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium">Notificaciones SMS</h4>
                <p className="text-sm text-muted-foreground">
                  Mensajes de texto para notificaciones críticas
                </p>
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

      {/* Tipos de Notificación */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Tipos de Notificaciones
        </h4>

        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium">Actualizaciones de Pedidos</h4>
                <p className="text-sm text-muted-foreground">
                  Cambios en el estado de tus pedidos
                </p>
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

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-medium">Alertas de Inventario</h4>
                <p className="text-sm text-muted-foreground">
                  Productos con stock bajo o agotado
                </p>
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

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Settings className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium">Alertas del Sistema</h4>
                <p className="text-sm text-muted-foreground">
                  Mantenimiento, actualizaciones y errores del sistema
                </p>
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
