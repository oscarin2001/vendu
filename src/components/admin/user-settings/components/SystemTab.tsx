"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Palette,
  Globe,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateSystemSettings,
  getSystemSettings,
} from "@/services/admin/user-settings";

interface SystemTabProps {
  userId: number;
}

const themeOptions = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export function SystemTab({ userId }: SystemTabProps) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    language: "es",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system" | undefined
  >(undefined);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const currentThemeOption =
    themeOptions.find((opt) => opt.value === selectedTheme) || themeOptions[2];

  // Load settings function
  const loadSettings = useCallback(async () => {
    try {
      const result = await getSystemSettings(userId);
      if (result.success && result.data) {
        setSettings({
          language: result.data.language,
        });
        // Set theme in both local state and next-themes
        const loadedTheme = result.data.theme;
        setSelectedTheme(loadedTheme);
        setTheme(loadedTheme);
        setSettingsLoaded(true);
      } else {
        toast.error("Error cargando configuraciones del sistema");
      }
    } catch (error) {
      console.error("Error loading system settings:", error);
      toast.error("Error cargando configuraciones del sistema");
    } finally {
      setLoading(false);
    }
  }, [userId, setTheme]);

  // Load settings on component mount
  useEffect(() => {
    if (!settingsLoaded) {
      loadSettings();
    }
  }, [loadSettings, settingsLoaded]);

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    const themeValue = newTheme as "light" | "dark" | "system";
    setSelectedTheme(themeValue);
    setTheme(themeValue);
  };

  const handleSave = async () => {
    if (!selectedTheme) {
      toast.error("Tema no seleccionado");
      return;
    }

    try {
      setSaving(true);
      const result = await updateSystemSettings(userId, {
        theme: selectedTheme,
        language: settings.language,
      });

      if (result.success) {
        toast.success("Configuraciones guardadas correctamente");
      } else {
        toast.error(result.error || "Error guardando configuraciones");
      }
    } catch (error) {
      console.error("Error saving system settings:", error);
      toast.error("Error guardando configuraciones");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Configuraciones del Sistema</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Personaliza la apariencia y configuración general
          </p>
        </div>

        {/* Selector de Tema Visual */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Tema de la Aplicación</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: "light",
                label: "Claro",
                icon: Sun,
                preview: "bg-white border border-gray-200",
                textColor: "text-gray-900",
              },
              {
                value: "dark",
                label: "Oscuro",
                icon: Moon,
                preview: "bg-gray-900 border border-gray-700",
                textColor: "text-white",
              },
              {
                value: "system",
                label: "Sistema",
                icon: Monitor,
                preview:
                  "bg-gradient-to-r from-white to-gray-100 border border-gray-300",
                textColor: "text-gray-700",
              },
            ].map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  selectedTheme === theme.value
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-full h-12 rounded mb-2 ${theme.preview} flex items-center justify-center`}
                >
                  <theme.icon className={`h-5 w-5 ${theme.textColor}`} />
                </div>
                <span className="text-xs font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Configuración de Idioma */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Idioma y Región</h4>
          </div>

          <Field>
            <FieldLabel className="text-sm">Idioma de la Interfaz</FieldLabel>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full p-2.5 border rounded-lg bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="es">es Español</option>
              <option value="en">en English</option>
              <option value="pt">pt Português</option>
              <option value="fr">fr Français</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Footer sticky */}
      <div className="pt-4 mt-6 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Check className="h-3 w-3 text-green-500" />
          Última actualización: hace 5 días
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Restablecer
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
